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

// const parserOpts= {
//   headerPattern: /^\[(\w*)\] - #(\d|[S\/N]+) - (.*)$/, // [type] - #numberofticket - Descriptions of the implementation.      
//   headerCorrespondence: ['type', 'references', 'subject']
// }

module.exports = {
  // extends: ['@commitlint/config-conventional'],
  parserPreset: {
    headerPattern: /^\[test\] .*$/
  },
  rules: {
    'type-enum': [2, 'always', types],
  }
};