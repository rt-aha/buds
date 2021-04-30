// https://eslint.org/docs/user-guide/getting-started
// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)

const eslintConfig = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:prettier/recommended'],
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
    'no-debugger': 0,
    'no-unused-vars': 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'import/no-self-import': 0,
    'max-len': 0,
    'import/prefer-default-export': 0,
  },
};

module.exports = eslintConfig;
