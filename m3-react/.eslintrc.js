module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'json',
    'unused-imports',
  ],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:storybook/recommended',
  ],
  globals: {
    process: true,
  },
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-this-alias': 'off',
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

    'import/export': 'error',
    'import/newline-after-import': 'error',
    'import/no-absolute-path': 'error',
    'import/no-cycle': 'error',
    'import/no-empty-named-blocks': 'error',
    'import/no-extraneous-dependencies': 'error',
    'import/no-self-import': 'error',
    'import/no-useless-path-segments': 'error',

    'unused-imports/no-unused-imports': 'error',
  },
  overrides: [{
    files: ['*.tsx'],
    rules: {
      'max-lines-per-function': 'off',
    },
  }, {
    files: ['.eslintrc.js'],
    env: {
      node: true,
    },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  }],
}
