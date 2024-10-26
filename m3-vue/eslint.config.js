import globals from 'globals'

import pluginJs from '@eslint/js'
import pluginTs from 'typescript-eslint'

import pluginImport from 'eslint-plugin-import'
import pluginImportUnused from 'eslint-plugin-unused-imports'

import pluginVue from 'eslint-plugin-vue'

export default [
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
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
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
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
      'import/no-empty-named-blocks': 'error',
      'import/no-extraneous-dependencies': 'error',
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',
      'import/no-unresolved': 'off',

      'unused-imports/no-unused-imports': 'error',

      'vue/attribute-hyphenation': 'error',
      'vue/attributes-order': 'error',
      'vue/component-definition-name-casing': ['error', 'PascalCase'],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/first-attribute-linebreak': 'error',
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always',
      }],
      'vue/html-closing-bracket-spacing': 'error',
      'vue/html-end-tags': 'error',
      'vue/html-indent': ['error', 4, {
        attribute: 1,
        closeBracket: 0,
        'alignAttributesVertically': true,
        'ignores': [],
      }],
      'vue/html-self-closing': ['error', {
        'html': {
          'void': 'always',
          'normal': 'always',
          'component': 'always',
        },
        'svg': 'always',
        'math': 'always',
      }],
      'vue/html-quotes': 'error',
      'vue/max-attributes-per-line': ['error', {
        'singleline': 4,
        'multiline': 1,
      }],
      'vue/multi-word-component-names': 'error',
      'vue/multiline-html-element-content-newline': 'error',
      'vue/mustache-interpolation-spacing': 'error',
      'vue/new-line-between-multi-line-property': 'error',
      'vue/no-child-content': 'error',
      'vue/no-empty-component-block': 'error',
      'vue/no-invalid-model-keys': 'error',
      'vue/no-lone-template': 'error',
      'vue/no-multi-spaces': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-potential-component-option-typo': 'error',
      'vue/no-reserved-component-names': 'error',
      'vue/no-template-shadow': 'error',
      'vue/no-unused-properties': 'error',
      'vue/no-unused-refs': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/no-useless-v-bind': 'error',
      'vue/no-v-model-argument': 'off',
      'vue/no-v-text-v-html-on-component': 'error',
      'vue/order-in-components': 'error',
      'vue/padding-line-between-blocks': 'error',
      'vue/require-default-prop': 'error',
      'vue/require-prop-types': 'error',
      'vue/this-in-template': 'error',
      'vue/v-bind-style': 'error',
      'vue/v-on-style': 'error',
      'vue/v-slot-style': 'error',
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: pluginTs.parser,
      },
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
