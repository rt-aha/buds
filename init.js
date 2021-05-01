const inquirer = require('inquirer');
const sh = require('shelljs');
const chalk = require('chalk');
const jsonfile = require('jsonfile');

class Repo {
  repoInfo = {};

  logStep() {
    let stepCount = 0;

    return (text) => {
      stepCount += 1;
      return console.log(chalk.green.bold(`STEP ${stepCount}: ${text}`));
    };
  }

  async askInfo() {
    const ans = await inquirer.prompt([
      {
        type: 'repoToken',
        name: 'repoToken',
        message: 'Repository token:',
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
        name: 'addNodeServer',
        message: 'Add on: a node server ?',
      },
    ]);
    this.repoInfo = ans;
  }

  create() {
    const log = this.logStep();

    const pipeline = [];

    // addNodeServer
    const {
      repoBelongTo,
      repoName,
      template,
      libs,
      repoVisibility,
      repoToken,
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
          husky: '^6.0.0',
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

    const createNodeServer = () => {
      sh.exec(`cd ${repoName} && git clone git@gitlab.com:p-template/node.git`);
      sh.exec(`cd ${repoName} && mv node nodeMockServer`);
      sh.exec(`cd ${repoName}/nodeMockServer && rm -rf .git`);
    };

    pipeline.push(createProjet);
    pipeline.push(cloneProject);
    pipeline.push(removeREADME);
    pipeline.push(setRemoteTemplateRepo);
    pipeline.push(pullTemplateRepo);
    pipeline.push(copyConfigFiles);
    if (libs.length !== 0) {
      pipeline.push(addLibsToDep);
    }
    pipeline.push(addToolsToDevDep);
    if (addNodeServer) {
      pipeline.push(createNodeServer);
    }
    pipeline.push(pushSetupRepo);

    for (let fn of pipeline) {
      fn();
    }
  }
}

const repo = new Repo();
repo.askInfo().then(() => repo.create());
// repo.modifyPackageJson('t-vue2', ['scss', 'network', 're-ui']);
