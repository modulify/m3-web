#!/usr/bin/env node

import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'

import ts from 'typescript'

const STORYBOOK_DIRECTORIES = [
  'm3-react/storybook',
  'm3-vue/storybook',
]

const storyFiles = async directory => {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(entry => {
    const path = join(directory, entry.name)

    return entry.isDirectory()
      ? storyFiles(path)
      : Promise.resolve(/\.stories\.tsx?$/.test(entry.name) ? [path] : [])
  }))

  return files.flat()
}

const mismatchedMeta = (source, path) => {
  const errors = []

  const visit = node => {
    if (ts.isSatisfiesExpression(node) &&
      ts.isTypeReferenceNode(node.type) &&
      node.type.typeName.getText(source) === 'Meta' &&
      node.type.typeArguments?.length === 1 &&
      ts.isTypeQueryNode(node.type.typeArguments[0]) &&
      ts.isObjectLiteralExpression(node.expression)) {
      const component = node.expression.properties.find(property =>
        ts.isPropertyAssignment(property) && property.name.getText(source) === 'component')
      const actual = component && ts.isIdentifier(component.initializer) ? component.initializer.text : null
      const declared = node.type.typeArguments[0].exprName.getText(source)

      if (actual && actual !== declared) {
        const line = source.getLineAndCharacterOfPosition(node.type.pos).line + 1
        errors.push(`${path}:${line}: component is ${actual}, but Meta uses typeof ${declared}`)
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(source)

  return errors
}

const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : (await Promise.all(STORYBOOK_DIRECTORIES.map(storyFiles))).flat()

const errors = (await Promise.all(files.map(async file => {
  const code = await readFile(file, 'utf8')
  const source = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)

  return mismatchedMeta(source, relative(process.cwd(), file))
}))).flat()

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Checked Storybook Meta components in ${files.length} stories`)
}
