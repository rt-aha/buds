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
        type: 'list',
        name: 'type',
        message: 'Select a type:',
        choices: ['feat', 'style', 'fix', 'chore', 'docs', 'perf', 'refactor', 'other'],
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

    const convertTypeToEmoji = {
      feat: 'sparkles', // 新功能
      style: 'lipstick', // 樣式
      fix: 'bug', // 修bug
      chore: 'pencil2', // 雜事
      docs: 'memo', // 文檔
      perf: 'zap', // 優化
      refactor: 'hammer', // 重構
      addon: 'package', // 加入新library/package/dependence
      other: 'speech_balloon', // 其他
      init: 'tada', // 初始化
      ci: 'green_heart', // ci 相關
      revert: 'rewind', // 回滾
      test: 'white_check_mark', // 測試
      release: 'bookmark', // 發布新版
    };

    console.log(chalk.green.bold('Wating git ...'));
    const emoji = convertTypeToEmoji[type];
    sh.exec('git add .');
    sh.exec(`git commit -m ":${emoji}: ${type}: ${commit}"`);
    sh.exec(`git push origin ${target}`);
  }
}

const commit = new Commit();
commit.askMsg().then(() => commit.pushToOrigin());
