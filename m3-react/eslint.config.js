import globals from 'globals'

import pluginDependencies from '@omnicajs/eslint-plugin-dependencies'
import pluginImport from 'eslint-plugin-import'
import pluginImportUnused from 'eslint-plugin-unused-imports'
import pluginJs from '@eslint/js'
import pluginReact from 'eslint-plugin-react'
import pluginStorybook from 'eslint-plugin-storybook'
import pluginTs from 'typescript-eslint'

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
      dependencies: pluginDependencies,
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
      '@typescript-eslint/consistent-type-imports': ['error', {
        disallowTypeAnnotations: false,
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      }],
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
      'complexity': 'off',
      'indent': ['error', 2, {
        ignoreComments: true,
        SwitchCase: 1,
      }],
      'linebreak-style': [2, 'unix'],
      'max-lines-per-function': ['error', 50],
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

      'dependencies/import-style': ['error', {
        maxSingleLineLength: 90,
        maxSingleLineSpecifiers: 3,
      }],
      'dependencies/separate-type-imports': 'error',
      'dependencies/separate-type-partitions': 'error',
      'dependencies/sort-named-imports': ['error', {
        type: 'alphabetical',
        ignoreAlias: true,
      }],
      'dependencies/sort-imports': ['error', {
        type: 'alphabetical',
        imports: {
          orderBy: 'alias',
          splitDeclarations: true,
        },
        groups: [
          'side-effect-style',
          'side-effect',
          [
            'type-import',
            'type-builtin',
            'type-external',
            'type-internal',
            'type-parent',
            'type-sibling',
            'type-index',
          ],
          'builtin',
          'value-external',
          'value-internal',
          ['value-parent', 'value-sibling'],
          'index',
          'ts-equals-import',
          'unknown',
        ],
        newlinesInside: 1,
        partitions: {
          orderBy: 'type-first',
          splitBy: {
            comments: false,
            newlines: true,
          },
        },
      }],

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

      'unused-imports/no-unused-imports': 'error',

      'react/react-in-jsx-scope': 'off',
      'storybook/no-renderer-packages': 'off',
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
    files: ['storybook/**/*.stories.{js,jsx,ts,tsx}'],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
  {
    files: ['tests/**/*.{js,jsx,ts,tsx}'],
    rules: {
      'max-lines-per-function': 'off',
      'no-magic-numbers': 'off',
    },
  },
  {
    files: [
      '**/*.e2e.ts',
      '**/*.e2e.tsx',
      '**/*.e2e.test.ts',
      '**/*.e2e.test.tsx',
      '**/*.smote.ts',
      '**/*.smoke.ts',
    ],
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
  { ignores: ['dist/*'] },
]
