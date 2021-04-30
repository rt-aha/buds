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
    }
  };

  modifyPackageJson(repoFolder, libsList) {
    if (libsList.length === 0) return;

    const file = `./${repoFolder}/package.json`;
    jsonfile.readFile(file, function (err, obj) {
      let { dependencies: dep } = obj;

      libsList.forEach(libName => {
        dep = {
          ...dep,
          [`@indigoichigo/${libName}`]: `https://gitlab.com/p-libs/${libName}.git`,
        }
      });

      pkg.dependencies = dep;

      jsonfile.writeFile(file, pkg, function (err) {
        if (err) console.error(err)
      })
    })
  }

  async askInfo() {
    const ans = await inquirer
      .prompt([
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
          choices: [
            "private",
            "public"
          ]
        },
        {
          type: 'list',
          name: 'template',
          message: 'Select a template:',
          choices: [
            new inquirer.Separator('--- vue ---'),
            "vue2-webpack-js",
            "vue3-webpack-js",
            "vue3-webpack-ts",
            "vue3-vite-js",
            "vue3-vite-ts",
            new inquirer.Separator('--- react ---'),
            "react-webpack-ts",
            "react-vite-ts",
            new inquirer.Separator('--- mpa ---'),
            "mpa",
            new inquirer.Separator('--- library ---'),
            "library",
            new inquirer.Separator('--- node ---'),
            "node",
          ]
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
          message: 'Add on: a node server ?'
        },
      ]);
    this.repoInfo = ans;
  }

  create() {
    const log = this.logStep();
    const { repoBelongTo, repoName, template, libs, repoVisibility, repoToken, addNodeServer } = this.repoInfo;

    log(`create a project named ${repoName}`);
    sh.exec(`curl --silent --output /dev/null --request POST 'https://gitlab.com/api/v4/projects?name=${repoName}&visibility=${repoVisibility}&initialize_with_readme=true' --header 'PRIVATE-TOKEN: ${repoToken}'`);

    log(`clone repo from ${repoBelongTo}/${repoName}.`);
    sh.exec(`git clone git@gitlab.com:${repoBelongTo}/${repoName}.git`);

    log(`remove README.md. (it will be wrote by template).`);
    sh.exec(`cd ${repoName} && rm -f README.md && git add README.md && git commit -m "[init] remove README.md"`)

    log(`set ${template} template remote address.`);
    sh.exec(`cd ${repoName} && git remote add tplt git@gitlab.com:p-template/${template}.git`)

    log(`pull ${template} template.`);
    sh.exec(`cd ${repoName} && git pull tplt master --allow-unrelated-histories --no-commit`)

    let step5Title = '';
    if (libs.length === 0) {
      step5Title = 'push to origin repository.'
    } else {
      step5Title = `add ${libs.join(', ')} libs and push to origin repository.`
    }
    log(step5Title);
    this.modifyPackageJson(repoName, libs);
    sh.exec(`cd ${repoName} && git add . && git commit -m "[init] create ${template} template" && git push origin master`)
  }
}

const repo = new Repo();
repo.askInfo().then(() => repo.create());
