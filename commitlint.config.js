const types = [
  'feat',
  'style',
  'fix',
  'chore',
  'docs',
  'perf',
  'refactor',
  'addon',
  'other',
  'init',
  'ci',
  'revert',
  'test',
  'release',
];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  // extends: ['gitmoji'],
  rules: {
    'type-enum': [2, 'always', types],
  },
};
