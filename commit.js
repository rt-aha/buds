const inquirer = require('inquirer');
const sh = require('shelljs');
const chalk = require('chalk');

class Commit {
  constructor() {
    this.commitInfo = {};
  }

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
          'feat (功能)',
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
    const { type, commit, target } = this.commitInfo;
    const [ansType] = type.split(' ');

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

    const emoji = convertTypeToEmoji[ansType];
    const commitMessage = `"${ansType}: ${commit} :${emoji}:"`;

    console.log(chalk.green.bold('Wating git ...'));
    // console.log(chalk.cyan(`The full commit message:`, chalk.cyan.bold(`${commitMessage}`)));

    try {
      sh.exec('git add .');
      sh.exec(`git commit -m ${commitMessage}`);
      sh.exec(`git push origin ${target}`);
    } catch (e) {
      console.log('e...', e);
    }
  }
}

const commit = new Commit();
commit.askMsg().then(() => commit.pushToOrigin());
