const eslintConfig = {
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
  globals: {
    document: true,
    localStorage: true,
    window: true,
    process: true,
    console: true,
    navigator: true,
    fetch: true,
    URL: true,
  },
  rules: {
    'no-console': 0,
    'no-alert': 1,
    'no-var': 1,
    'no-catch-shadow': 2,
    'default-case': 0,
    'dot-notation': [0, {allowKeywords: true}],
    'no-constant-condition': 2,
    'no-dupe-args': 2,
    'no-inline-comments': 0,
    'no-unreachable': 2,
    'no-unused-vars': [2, {vars: 'all', args: 'after-used'}],
    'no-unused-expressions': 2,
    'no-mixed-spaces-and-tabs': [2, false],
    'linebreak-style': [0, 'windows'],
    'no-multiple-empty-lines': [1, {max: 2}],
    'no-extra-semi': 2,
    'no-debugger': 2,
    eqeqeq: 2,

    'eol-last': 0,
    'lines-around-comment': 0,
    'prefer-const': 0,
    quotes: [1, 'single'],
    'id-match': 0,
    'arrow-body-style': 0,
    strict: 2,
    'use-isnan': 2,
    'valid-typeof': 2,
    'space-in-parens': [0, 'always'],

    'object-curly-spacing': [0, 'always'],

    'no-use-before-define': [2, {functions: false}],
    'class-methods-use-this': 'off',
    'no-undef': [1],
    'no-case-declarations': [1],
    'no-return-assign': [1],
    'no-param-reassign': [1],
    'no-shadow': [1],
    camelcase: [1],
    'no-underscore-dangle': [0, 'always'],
  },
};

module.exports = eslintConfig;
