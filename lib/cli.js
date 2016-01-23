var program = require('commander');
var pkg = require('../package.json');
var gateway = require('./gateway');
var colors = require('colors');

program.version(pkg.version)
  .option('-t, --token [personal access token]', 'Specify access token')
  .parse(process.argv);

console.log(colors.blue('------- License Up -------\n'));

gateway(program.token, function (err, res) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(colors.blue('\n-----------------------------------'));
  console.log(colors.blue('Updated %d repos:'), res.updatedRepoNames.length);
  console.log(colors.blue('%s'), res.updatedRepoNames.join(', '));
});
