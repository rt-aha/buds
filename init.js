const inquirer = require('inquirer');
const sh = require('shelljs');
const chalk = require('chalk');
const jsonfile = require('jsonfile');
const yaml = require('js-yaml');
const fs = require('fs');

class Repo {
  constructor() {
    this.repoInfo = {};
    this.pipeline = [];
  }

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
        message: 'Repository account',
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
    ]);
    this.repoInfo = ans;

    if (this.repoInfo.template !== 'node') {
      const ans2 = await inquirer.prompt([
        {
          type: 'checkbox',
          message: 'Select librarys',
          name: 'libs',
          choices: [
            {
              name: 're-ui',
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

      this.repoInfo = {
        ...ans,
        ...ans2,
      };
    }
  }

  create() {
    const log = this.logStep();

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

    const is = {
      vue: template.indexOf('vue') > -1,
      react: template.indexOf('react') > -1,
      ts: template.indexOf('ts') > -1,
      node: template.indexOf('node') > -1,
      mpa: template.indexOf('mpa') > -1,
    };

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
      sh.cp('.stylelintrc.js', `./${repoName}`);

      if (template.indexOf('node') === -1) {
        sh.cp('.prettierrc.js', `./${repoName}`);
        sh.cp('.prettierignore', `./${repoName}`);
      }

      if (template.indexOf('ts') > -1) {
        sh.cp('tsconfig.json', `./${repoName}`);
        sh.cp('tsconfig.extend.json', `./${repoName}`);
      } else {
        sh.cp('jsconfig.json', `./${repoName}`);
      }

      // commit.js
      sh.cp('commit.js', `./${repoName}`);
      sh.cp('commitlint.config.js', `./${repoName}`);
    };
    const pushSetupRepo = () => {
      log('push to repository');

      sh.exec(
        `cd ${repoName} && git add . && git commit -m ":tada: init: create ${template} template" && git push origin master`,
      );
    };

    const modifyPackageFile = () => {
      log('add the library which used for development to package.json/devDependencies.');
      const file = `./${repoName}/package.json`;
      jsonfile.readFile(file, function (err, pkg) {
        let { scripts, dependencies: dep, devDependencies: devDep } = pkg;

        if (libs.length !== 0) {
          libs.forEach((libName) => {
            dep = {
              ...dep,
              '@indigoichigo/scss': 'https://gitlab.com/p-libs/scss.git',
              '@indigoichigo/network': 'https://gitlab.com/p-libs/network.git',
              [`@indigoichigo/${libName}`]: `https://gitlab.com/p-libs/${libName}.git`,
            };
          });
        }

        scripts = {
          ...scripts,
          commit: 'node commit.js',
          release: 'standard-version && git push --follow-tags origin master && && git add .',
          'lint:style': 'stylelint src/**/*.scss src/**/*.css --syntax scss --fix',
          'lint:prettier': 'prettier --write .',
          'lint:js.ts': 'eslint --fix',
        };

        let eslintPlugin = {};

        if (is.vue) {
          eslintPlugin = {
            ...eslintPlugin,
            'eslint-plugin-prettier': '^3.3.1',
            'eslint-plugin-vue': '^6.2.2',
          };
        }

        if (is.react) {
          eslintPlugin = {
            ...eslintPlugin,
            'eslint-plugin-react': '^7.23.2',
          };
        }

        if (is.ts) {
          eslintPlugin = {
            ...eslintPlugin,
            '@typescript-eslint/eslint-plugin': '^4.22.0',
            '@typescript-eslint/parser': '^4.22.0',
          };
        }

        let stylelintPlugin = {};

        if (!is.node) {
          stylelintPlugin = {
            stylelint: '^13.13.0',
            'stylelint-config-prettier': '^8.0.2',
            'stylelint-config-sass-guidelines': '^8.0.0',
            'stylelint-config-standard': '^22.0.0',
            'stylelint-no-unsupported-browser-features': '^4.1.4',
            'stylelint-order': '^4.1.0',
            'stylelint-scss': '^3.19.0',
          };
        }

        devDep = {
          ...devDep,
          ...eslintPlugin,
          ...stylelintPlugin,
          '@commitlint/cli': '^12.1.1',
          '@commitlint/config-conventional': '^12.1.1',
          '@typescript-eslint/eslint-plugin': '^4.22.0',
          '@typescript-eslint/parser': '^4.22.0',
          'babel-eslint': '^10.1.0',
          chalk: '^4.1.1',
          eslint: '^7.2.0',
          'eslint-config-prettier': '^8.3.0',
          'eslint-plugin-import': '^2.22.1',
          'eslint-plugin-jsx-a11y': '^6.4.1',
          'eslint-plugin-prettier': '^3.4.0',
          husky: '4.3.8',
          inquirer: '^8.0.0',
          'js-yaml': '^4.1.0',
          jsonfile: '^6.1.0',
          'lint-staged': '^10.5.4',
          prettier: '^2.2.1',
          shelljs: '^0.8.4',
          'standard-version': '^9.2.0',
          typescript: '^4.2.4',
          'write-json-file': '^4.3.0',
        };

        pkg['husky'] = {
          hooks: {
            'commit-msg': 'commitlint -e $HUSKY_GIT_PARAMS',
            'pre-commit': 'lint-staged',
          },
        };

        pkg['lint-staged'] = {
          '*.{scss,css}': ['yarn lint:style'],
          '*.{js,ts}': ['yarn lint:js.ts'],
          '*.{html,css,sccc,js,jsx,tsx,vue}': ['yarn lint:prettier'],
        };

        pkg.dependencies = dep;
        pkg.devDependencies = devDep;
        pkg.scripts = scripts;
        pkg.name = repoName;

        jsonfile.writeFile(file, pkg, { spaces: 2 }, function (e) {
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
          if (err) console.error(err);
        });
      } catch (e) {
        console.log(e);
      }
    };

    const genEslintrcFile = () => {
      log(`generate .eslintrc.js file`);
      const initEslint = require('./initEslintrc');

      let cloneInitEslint = JSON.parse(JSON.stringify(initEslint));
      let { env, parser, extends: exts } = cloneInitEslint;
      const plugins = [];

      const handleEnv = () => {
        // mpa only add browser,
        // node only add node,
        // others(vue, react...etc) add both browser and node(because it may used in SSR);
        if (!is.mpa) {
          env = {
            ...env,
            node: true,
          };
        }

        if (!is.node) {
          env = {
            ...env,
            browser: true,
          };
        }
      };

      const handleFramework = () => {
        if (is.vue) {
          exts.push('plugin:vue/essential');
          exts.push('@vue/prettier');
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

      cloneInitEslint = JSON.stringify(cloneInitEslint, null, 2);

      fs.writeFile(`./${repoName}/.eslintrc.js`, `module.exports = ${cloneInitEslint}`, (err) => {
        if (err) {
          return console.log(err);
        }
      });
    };

    const createNodeServer = () => {
      log('create a node mock server.');
      sh.exec(`git clone git@gitlab.com:p-template/node.git`);
      sh.exec(`mv node nodeMockServer`);
      sh.exec(`cd nodeMockServer && rm -rf .git`);
      sh.cp('-R', 'nodeMockServer', `./${repoName}`);
      sh.rm('-rf', 'nodeMockServer');
    };

    this.pipeline.push(createProjet);
    this.pipeline.push(cloneProject);
    this.pipeline.push(removeREADME);
    this.pipeline.push(setRemoteTemplateRepo);
    this.pipeline.push(pullTemplateRepo);
    this.pipeline.push(copyConfigFiles);

    if (gitlabCi) {
      this.pipeline.push(createGitlabYml);
    }

    if (addNodeServer) {
      this.pipeline.push(createNodeServer);
    }

    this.pipeline.push(genEslintrcFile);

    this.pipeline.push(modifyPackageFile);
    this.pipeline.push(pushSetupRepo);

    for (let fn of this.pipeline) {
      fn();
    }

    this.pipeline = [];
  }
}

const repo = new Repo();
// repo.askInfo();
repo.askInfo().then(() => repo.create());
