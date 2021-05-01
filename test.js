const sh = require('shelljs');
const repoName = 'nodeTest';

const createNodeServer = () => {
  sh.exec(`mkdir ${repoName}`);
  sh.exec(`cd ${repoName} && git clone git@gitlab.com:p-template/node.git`);
  sh.exec(`cd ${repoName} && mv node nodeMockServer`);
  sh.exec(`cd ${repoName}/nodeMockServer && rm -rf .git`);
};

createNodeServer();
