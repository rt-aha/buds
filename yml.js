const yaml = require('js-yaml');
const fs = require('fs');

try {
  const doc = yaml.load(fs.readFileSync('./gitlabCi.json', 'utf8'));

  const ymlFile = yaml.dump(doc);

  fs.writeFile('.gitlab-ci.yml', ymlFile, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });
} catch (e) {
  console.log(e);
}
