const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select a template:',
      choices: ['vue', 'node'],
    },
  ])
  .then((ans) => {
    console.log(ans);
  })
  .then(() => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Select a template:',
          choices: ['vue', 'node'],
        },
      ])
      .then((ans) => {
        console.log('ans2', ans);
      });
  });
