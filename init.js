const inquirer = require('inquirer');
const sh = require('shelljs');
const chalk = require('chalk');
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');
const fs = require('fs');

class Repo {
  repoInfo = {};
  pipeline = [];

  logStep() {
    let stepCount = 0;

    return (text) => {
      stepCount += 1;
      const pipelineLength = this.pipeline.length;
      return console.log(chalk.green.bold(`PROGRESS (${stepCount}/${pipelineLength}): ${text}`));
    };
  }

  async askInfo() {
    const ans = await inquirer.prompt([
      {
        type: 'repoToken',
        name: 'repoToken',
        message: 'Repository token:',
        default: 'Em_rZ9kRgTVr6uVxzz6K',
      },
      {
        type: 'input',
        name: 'repoBelongTo',
        message: 'Repository account/group name:',
        default: 'silentice1534',
      },
      {
        type: 'input',
        name: 'repoName',
        message: 'Repository name:',
        default: 'testing',
      },
      {
        type: 'list',
        name: 'repoVisibility',
        message: 'Repository Visibility:',
        choices: ['private', 'public'],
      },
      {
        type: 'list',
        name: 'template',
        message: 'Select a template:',
        choices: [
          new inquirer.Separator('--- vue ---'),
          'vue2-webpack-js',
          'vue3-webpack-js',
          'vue3-webpack-ts',
          'vue3-vite-js',
          'vue3-vite-ts',
          new inquirer.Separator('--- react ---'),
          'react-webpack-ts',
          'react-vite-ts',
          new inquirer.Separator('--- mpa ---'),
          'mpa',
          new inquirer.Separator('--- library ---'),
          'library',
          new inquirer.Separator('--- node ---'),
          'node',
        ],
      },
      {
        type: 'checkbox',
        message: 'Select librarys',
        name: 'libs',
        choices: [
          {
            name: 're-ui',
          },
          {
            name: 'scss',
          },
          {
            name: 'network',
          },
        ],
      },
      {
        type: 'confirm',
        name: 'gitlabCi',
        message: 'Add on: create .gitlab-ci.yml ?',
      },
      {
        type: 'confirm',
        name: 'addNodeServer',
        message: 'Add on: a node server ?',
      },
    ]);
    this.repoInfo = ans;
  }

  create() {
    const log = this.logStep();

    // addNodeServer
    const {
      repoBelongTo,
      repoName,
      template,
      libs,
      repoVisibility,
      repoToken,
      gitlabCi,
      addNodeServer,
    } = this.repoInfo;
    const createProjet = () => {
      log(`create a project named ${repoName}`);
      sh.exec(
        `curl --silent --output /dev/null --request POST 'https://gitlab.com/api/v4/projects?name=${repoName}&visibility=${repoVisibility}&initialize_with_readme=true' --header 'PRIVATE-TOKEN: ${repoToken}'`,
      );
    };
    const cloneProject = () => {
      log(`clone repo from ${repoBelongTo}/${repoName}.`);
      sh.exec(`git clone git@gitlab.com:${repoBelongTo}/${repoName}.git`);
    };
    const removeREADME = () => {
      log('remove README.md. (it will be wrote by template).');
      sh.exec(
        `cd ${repoName} &&
         rm -f README.md &&
         git add README.md &&
         git commit -m "[init] remove README.md"`,
      );
    };
    const setRemoteTemplateRepo = () => {
      log(`set ${template} template remote address.`);
      sh.exec(`cd ${repoName} && git remote add tplt git@gitlab.com:p-template/${template}.git`);
    };
    const pullTemplateRepo = () => {
      log(`pull ${template} template.`);
      sh.exec(`cd ${repoName} && git pull tplt master --allow-unrelated-histories --no-commit`);
    };

    const copyConfigFiles = () => {
      log('copy config files.');
      sh.cp('-R', '.vscode', `./${repoName}`);
      sh.cp('.editorconfig', `./${repoName}`);
      sh.cp('.browserslistrc', `./${repoName}`);
      sh.cp('.prettierrc.js', `./${repoName}`);
      sh.cp('.stylelintrc.js', `./${repoName}`);
      // sh.cp('.eslintrc.js', `./${repoName}`);

      if (template.includes('ts')) {
        sh.cp('tsconfig.json', `./${repoName}`);
        sh.cp('tsconfig.extend.json', `./${repoName}`);
      } else {
        sh.cp('jsconfig.json', `./${repoName}`);
      }

      // commit.js
      //先安裝一些東西
      sh.cp('commit.js', `./${repoName}`);
      sh.cp('commitlint.config.js', `./${repoName}`);
    };
    const pushSetupRepo = () => {
      log('push to repository');
      let step5Title = '';
      if (libs.length === 0) {
        step5Title = 'push to origin repository.';
      } else {
        step5Title = `add ${libs.join(', ')} libs and push to origin repository.`;
      }
      log(step5Title);

      sh.exec(
        `cd ${repoName} && git add . && git commit -m ":tada: init: create ${template} template" && git push origin master`,
      );
    };

    const addLibsToDep = () => {
      log('add selected Libaray to package.json/dependencies.');
      const file = `./${repoName}/package.json`;
      jsonfile.readFile(file, function (err, pkg) {
        let { dependencies: dep } = pkg;

        libs.forEach((libName) => {
          dep = {
            ...dep,
            [`@indigoichigo/${libName}`]: `https://gitlab.com/p-libs/${libName}.git`,
          };
        });

        pkg.dependencies = dep;

        jsonfile.writeFile(file, pkg, function (e) {
          if (e) console.error(e);
        });
      });
    };

    const addToolsToDevDep = () => {
      log('add the library which used for development to package.json/devDependencies.');
      const file = `./${repoName}/package.json`;
      jsonfile.readFile(file, function (err, pkg) {
        let { devDependencies: devDep } = pkg;

        devDep = {
          ...devDep,
          stylelint: '^13.13.0',
          'stylelint-config-prettier': '^8.0.2',
          'stylelint-config-sass-guidelines': '^8.0.0',
          'stylelint-config-standard': '^22.0.0',
          'stylelint-no-unsupported-browser-features': '^4.1.4',
          'stylelint-order': '^4.1.0',
          'stylelint-scss': '^3.19.0',
          husky: '4.3.8',
          inquirer: '^8.0.0',
          jsonfile: '^6.1.0',
          'lint-staged': '^10.5.4',
          prettier: '^2.2.1',
          shelljs: '^0.8.4',
          chalk: '^4.1.1',
          'commitlint-config-gitmoji': '^2.2.3',
          eslint: '^7.2.0',
          '@commitlint/cli': '^12.1.1',
        };

        pkg.devDependencies = devDep;

        jsonfile.writeFile(file, pkg, function (e) {
          if (e) console.error(e);
        });
      });
    };

    const createGitlabYml = () => {
      log('create .gitlab-ci.yml file.');
      try {
        const doc = yaml.load(fs.readFileSync('./gitlabCi.json', 'utf8'));

        const ymlFile = yaml.dump(doc);

        fs.writeFile('.gitlab-ci.yml', ymlFile, function (err) {
          sh.exec(`mv .gitlab-ci.yml ./${repoName}`);
        });
      } catch (e) {
        console.log(e);
      }
    };

    const createNodeServer = () => {
      log('create a node mock server.');
      sh.exec(`cd ${repoName} && git clone git@gitlab.com:p-template/node.git`);
      sh.exec(`cd ${repoName} && mv node nodeMockServer`);
      sh.exec(`cd ${repoName}/nodeMockServer && rm -rf .git`);
    };

    const addCommitlint = () => {
      sh.exec(`cd ${repoName} && yarn add husky@latest --dev`);
      sh.exec(`cd ${repoName} && yarn husky install`);
      sh.exec(
        `cd ${repoName} && npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'`,
      );

      const file = `./${repoName}/package.json`;
      jsonfile.readFile(file, function (err, pkg) {
        pkg['husky'] = {
          husky: {
            hooks: {
              'commit-msg': 'commitlint -e $HUSKY_GIT_PARAMS',
              'pre-commit': 'lint-staged',
            },
            'lint-staged': {
              '*.js': ['vue-cli-service lint', 'git add'],
              '*.vue': ['vue-cli-service lint', 'git add'],
            },
          },
        };

        jsonfile.writeFile(file, pkg, function (e) {
          if (e) console.error(e);
        });
      });
    };

    this.pipeline.push(createProjet);
    this.pipeline.push(cloneProject);
    this.pipeline.push(removeREADME);
    this.pipeline.push(setRemoteTemplateRepo);
    this.pipeline.push(pullTemplateRepo);
    this.pipeline.push(copyConfigFiles);
    if (libs.length !== 0) {
      this.pipeline.push(addLibsToDep);
    }
    this.pipeline.push(addToolsToDevDep);
    if (addNodeServer) {
      this.pipeline.push(createNodeServer);
    }
    if (gitlabCi) {
      this.pipeline.push(createGitlabYml);
    }
    this.pipeline.push(addCommitlint);
    this.pipeline.push(pushSetupRepo);

    for (let fn of this.pipeline) {
      fn();
    }

    this.pipeline = [];
  }
}

const repo = new Repo();
repo.askInfo().then(() => repo.create());
