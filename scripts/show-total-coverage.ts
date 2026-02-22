import { readFileSync } from 'node:fs'

type CoverageMetric = {
  covered: number;
  total: number;
}

type CoverageSummary = {
  total: {
    statements: CoverageMetric;
    branches: CoverageMetric;
    functions: CoverageMetric;
    lines: CoverageMetric;
  };
}

const summaryPath = process.argv[2] ?? 'coverage/coverage-summary.json'
const summary = JSON.parse(readFileSync(summaryPath, 'utf8')) as CoverageSummary

const totalCovered = (
  summary.total.statements.covered
  + summary.total.branches.covered
  + summary.total.functions.covered
  + summary.total.lines.covered
)

const totalChecks = (
  summary.total.statements.total
  + summary.total.branches.total
  + summary.total.functions.total
  + summary.total.lines.total
)

const percentage = totalChecks === 0 ? 0 : (totalCovered / totalChecks) * 100

console.log(`Total coverage: ${percentage.toFixed(2)}%`)
