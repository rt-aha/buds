const sh = require('shelljs');

const repoName = 'h1';
sh.exec(`cd ${repoName} && yarn add husky@latest --dev`);
sh.exec(`cd ${repoName} && yarn husky install`);
sh.exec(
  `cd ${repoName} && npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`,
);
