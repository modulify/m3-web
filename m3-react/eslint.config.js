import globals from 'globals'

import pluginJs from '@eslint/js'
import pluginTs from 'typescript-eslint'

import pluginImport from 'eslint-plugin-import'
import pluginImportUnused from 'eslint-plugin-unused-imports'

import pluginReact from 'eslint-plugin-react'
import pluginStorybook from 'eslint-plugin-storybook'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx'] },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'unused-imports': pluginImportUnused,
    },
  },
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  ...pluginTs.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...pluginStorybook.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-var-requires': 'off',

      'brace-style': ['error', '1tbs', {
        allowSingleLine: true,
      }],
      'comma-dangle': ['error', {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
        imports: 'always-multiline',
        objects: 'always-multiline',
      }],
      'indent': ['error', 2, {
        ignoreComments: true,
        SwitchCase: 1,
      }],
      'linebreak-style': [2, 'unix'],
      'max-lines-per-function': ['error', 30],
      'max-nested-callbacks': ['error', 3],
      'no-console': 'off',
      'no-constant-condition': 'off',
      'no-debugger': process.env.ENV === 'development' ? 'off' : 'error',
      'no-empty': 'off',
      'no-multiple-empty-lines': ['error', {
        max: 1,
        maxBOF: 0,
        maxEOF: 0,
      }],
      'no-new-wrappers': 'error',
      'no-prototype-builtins': 'error',
      'no-shadow-restricted-names': 'error',
      'no-throw-literal': 'error',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off',
      'padded-blocks': ['error', 'never'],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],

      'import/named': 'off',
      'import/newline-after-import': 'error',
      'import/no-absolute-path': 'error',
      'import/no-cycle': 'error',
      'import/no-duplicates': 'off',
      'import/no-empty-named-blocks': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-unresolved': 'off',

      //'unused-imports/no-unused-imports': 'error',

      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.tsx'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  { ignores: ['dist/*'] },
]
