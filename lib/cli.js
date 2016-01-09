var program = require('commander');
var pkg = require('../package.json');
var gateway = require('./gateway');

program.version(pkg.version)
  .option('-t, --token [personal access token]', 'Specify access token')
  .parse(process.argv);

gateway(program.token, function (err, res) {
  if (err) {
    console.log(err);
    return;
  }

  console.log(res);
});
