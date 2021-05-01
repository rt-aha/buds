const inquirer = require('inquirer');
const sh = require('shelljs');
const chalk = require('chalk');

class Commit {
  commitInfo = {};

  async askMsg() {
    const ans = await inquirer.prompt([
      {
        type: 'input',
        name: 'target',
        default: 'master',
        message: 'Enter origin branch:',
      },
      {
        type: 'rawlist',
        name: 'type',
        message: 'Select a type:',
        choices: [
          'feat (新功能)',
          'style (樣式)',
          'fix (修bug)',
          'chore (雜事)',
          'docs (文檔)',
          'perf (優化)',
          'refactor (重構)',
          'addon (加入新library/package/dependence)',
          'other (其他)',
          'init (初始化)',
          'ci (ci 相關)',
          'revert (回滾)',
          'test (測試)',
          'release (發布新版)',
        ],
      },
      {
        type: 'input',
        name: 'commit',
        message: 'Enter commit:',
      },
    ]);
    this.commitInfo = ans;
  }

  pushToOrigin() {
    const {type, commit, target} = this.commitInfo;
    const [ansType] = type.split(' ');
    console.log('ansType', ansType);

    const convertTypeToEmoji = {
      feat: 'sparkles',
      style: 'lipstick',
      fix: 'bug',
      chore: 'pencil2',
      docs: 'memo',
      perf: 'zap',
      refactor: 'hammer',
      addon: 'package',
      other: 'speech_balloon',
      init: 'tada',
      ci: 'green_heart',
      revert: 'rewind',
      test: 'white_check_mark',
      release: 'bookmark',
    };

    console.log(chalk.green.bold('Wating git ...'));
    const emoji = convertTypeToEmoji[ansType];
    sh.exec('git add .');
    sh.exec(`git commit -m ":${emoji}: ${ansType}: ${commit}"`);
    sh.exec(`git push origin ${target}`);
  }
}

const commit = new Commit();
commit.askMsg().then(() => commit.pushToOrigin());
