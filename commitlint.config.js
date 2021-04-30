const types = [
  'feat',
  'style',
  'fix',
  'chore',
  'docs',
  'perf',
  'refactor',
  'other'
];

module.exports = {
  // '@commitlint/config-conventional', 
  extends: ['gitmoji'],
  rules: {
    'type-enum': [2, 'always', types],
  }
};