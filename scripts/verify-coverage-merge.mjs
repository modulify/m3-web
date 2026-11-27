import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

import coverage from 'istanbul-lib-coverage'

const { createCoverageMap } = coverage
const readJson = path => JSON.parse(readFileSync(path, 'utf8'))
const config = readJson('.nycrc.json')
const parts = [
  'e2e-react.json',
  'e2e-vue.json',
  'unit-foundation.json',
  'unit-react.json',
  'unit-vue.json',
]
const metrics = ['statements', 'branches', 'functions', 'lines']
const sourceRoots = config.include.map(pattern => pattern.replace(/\*\*$/, ''))

assert.deepEqual(readdirSync('coverage/.parts').sort(), parts)

const merged = createCoverageMap({})
const sourceMaps = new Map()

for (const part of parts) {
  const report = readJson(join('coverage/.parts', part))

  for (const [file, entry] of Object.entries(report)) {
    const previous = sourceMaps.get(file)

    if (previous) {
      for (const field of ['statementMap', 'fnMap', 'branchMap']) {
        assert.deepEqual(entry[field], previous[field], `${part}: ${file}: ${field} differs`)
      }
    } else {
      sourceMaps.set(file, entry)
    }
  }

  merged.merge(report)
}

const raw = createCoverageMap(readJson('.nyc_output/coverage-final.json'))
assert.deepEqual(raw.files().sort(), merged.files().sort(), 'Raw merge omitted input files')

for (const file of merged.files()) {
  assert.deepEqual(raw.fileCoverageFor(file).toJSON(), merged.fileCoverageFor(file).toJSON(), `${file}: raw merge differs`)
}

const productionFiles = merged.files().filter(file => {
  return sourceRoots.some(root => file.includes('/' + root)) && config.extension.includes(extname(file))
}).sort()
const summary = readJson('coverage/coverage-summary.json')
const reportedFiles = Object.keys(summary).filter(file => file !== 'total').sort()

assert.deepEqual(reportedFiles, productionFiles, 'NYC summary omitted production files')

const production = createCoverageMap({})

for (const file of productionFiles) {
  const result = merged.fileCoverageFor(file)
  const expected = result.toSummary().toJSON()
  production.addFileCoverage(result)

  for (const metric of metrics) {
    assert.equal(summary[file][metric].covered, expected[metric].covered, `${file}: ${metric} covered`)
    assert.equal(summary[file][metric].total, expected[metric].total, `${file}: ${metric} total`)
  }
}

const totals = production.getCoverageSummary().toJSON()

for (const metric of metrics) {
  assert.equal(summary.total[metric].covered, totals[metric].covered, `${metric} covered`)
  assert.equal(summary.total[metric].total, totals[metric].total, `${metric} total`)
}

console.log(`Verified merged coverage for ${productionFiles.length} source files`)
