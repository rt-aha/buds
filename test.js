const initEslint = require('./initEslintrc');

let cloneInitEslint = JSON.parse(JSON.stringify(initEslint));
let { env, parser, extends: exts } = cloneInitEslint;

const fs = require('fs');
// const jsonfile = require('jsonfile');

const repoName = 't2';

const template = 'vue2-webpack.js';

const is = {
  vue: template.indexOf('vue') > -1,
  react: template.indexOf('react') > -1,
  ts: template.indexOf('ts') > -1,
  node: template.indexOf('node') > -1,
  mpa: template.indexOf('mpa') > -1,
};

console.log('is...', is);

const plugins = [];

const handleEnv = () => {
  // mpa only add browser,
  // node only add node,
  // others(vue, react...etc) add both browser and node(because it may used in SSR);
  if (!is.mpa) {
    console.log('d1');
    env = {
      ...env,
      node: true,
    };
  }

  if (!is.node) {
    console.log('d2');
    env = {
      ...env,
      browser: true,
    };
  }
};

const handleFramework = () => {
  if (is.vue) {
    exts.push('plugin:vue/essential');
    plugins.push('vue');
  }

  if (is.react) {
    exts.push('plugin:react/essential');
    plugins.push('react');
  }
};

const handleTypescript = () => {
  if (is.ts) {
    exts.push('plugin:@typescript-eslint/recommended');
    plugins.push('@typescript-eslint');
    parser = '@typescript-eslint/parser';
  }
};

handleEnv();
handleFramework();
handleTypescript();

cloneInitEslint = {
  ...cloneInitEslint,
  plugins,
  env,
  parser,
  extends: exts,
};

cloneInitEslint = JSON.stringify(cloneInitEslint);

fs.writeFile(`./${repoName}/.eslintrc.js`, `module.exports = ${cloneInitEslint}`, function (err) {
  if (err) {
    return console.log(err);
  }
  console.log('The file was saved!');
});
