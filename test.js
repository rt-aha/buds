const sh = require('shelljs');

const repoName = 'mockRepo';

// vscode setting
sh.cp('-R', '.vscode', `./${repoName}`);

// browserslintrc
sh.cp('.browserslistrc', `./${repoName}`);

// prettier
sh.cp('.prettierrc.js', `./${repoName}`);

// stylelint
sh.cp('.stylelintrc.js', `./${repoName}`);

// eslint
sh.cp('.eslintrc.js', `./${repoName}`);

// 下面這兩個要判斷
// jsconfig.json
sh.cp('jsconfig.json', `./${repoName}`);
// tsconfig.json
sh.cp('tsconfig.json', `./${repoName}`);
sh.cp('tsconfig.extend.json', `./${repoName}`);

// babel.config.js
// vue 和 react 模板 由template自產
// mpa 和 node 模板 由g-bud複製進去
sh.cp('.babelrc.json', `./${repoName}`);

// add node
sh.exec(`cd ${repoName} && git clone git@gitlab.com:p-template/node.git`);
sh.exec(`cd ${repoName} && mv node nodeMockServer`);
sh.exec(`cd ${repoName}/nodeMockServer && rm -rf .git`);

// gitlab-ci.yml
// 生成README.ME(動態生成，初始化專案有配置的內容)
