const inquirer = require('inquirer');
const sh = require('shelljs');
const chalk = require('chalk');
const jsonfile = require('jsonfile');

class Commit {
  commitInfo = {};

  async askMsg() {
    const ans = await inquirer
      .prompt([
        {
          type: 'input',
          name: 'target',
          default: 'master',
          message: 'Enter origin branch:',
        },
        {
          type: 'list',
          name: 'type',
          message: 'Select a Type:',
          choices: [
            'feat',
            'style',
            'fix',
            'chore',
            'docs',
            'perf',
            'refactor',
            'other'
          ]
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

    console.log(chalk.green.bold(`Wating git ...`));
    const emoji = convertTypeToEmoji[type]
    sh.exec('git add .');
    sh.exec(`git commit -m ":${emoji}: ${type}: ${commit}"`);
    sh.exec(`git push origin ${target}`);
  }
}

const commit = new Commit();
commit.askMsg().then(() => commit.pushToOrigin());
