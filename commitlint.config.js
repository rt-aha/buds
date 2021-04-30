const types = [
  'feat',
  'style',
  'fix',
  'chore',
  'docs',
  'perf',
  'refactor',
  'other'
]

module.exports = {
  // extends: ['@commitlint/config-conventional'],
  reles: {
    'type-enum': [2, 'always', types],
  }
};