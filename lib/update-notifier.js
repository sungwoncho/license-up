// Notify the user if there is a new version of this package
var updateNotifier = require('update-notifier');
var pkg = require('../package.json');

var notifier = updateNotifier({
  pkg: pkg
});

notifier.notify();
