var GithubAPI = require('github');
var async = require('async');
var locater = require('locater');
var moment = require('moment');

var updateLicense = require('./update-license');

module.exports = function (token, done) {
  var github = new GithubAPI({
    version: '3.0.0',
  });

  github.authenticate({
    type: 'oauth',
    token: token
  });

  var checkIfUpdateNeeded = function (repo, callback) {
    var msg = {
      user: repo.owner.login,
      repo: repo.name,
      path: 'LICENSE'
    };

    github.repos.getContent(msg, function (err, licenseData) {
      if (err) {
        callback(err);
      }

      var encodedLicense = new Buffer(licenseData.content, 'base64');
      var licenseContent = encodedLicense.toString('utf8');

      var match = /(\d{4})/g.exec(licenseContent);
      if (parseInt(match[1]) < parseInt(moment().format('YYYY'))) {
        callback(null, repo, licenseContent, licenseData.sha);
      } else {
        callback();
      }
    });
  };

  var performUpdate = function (repo, licenseContent, sha, callback) {
    if (!repo) {
      callback();
    }

    var updatedContent = updateLicense(licenseContent);
    var encodedContent = (new Buffer(updatedContent)).toString('base64');

    var msg = {
      user: repo.owner.login,
      repo: repo.name,
      path: 'LICENSE',
      message: 'Update the year',
      content: encodedContent,
      sha: sha
    };
    github.repos.updateFile(msg, function (err, res) {
      if (err) {
        callback(err);
        return;
      }

      callback(null, res);
    });
  };

  github.repos.getAll({affiliation: 'owner'}, function (err, repos) {
    if (err) {
      console.log(err);
      return;
    }

    repos.forEach(function (repo) {
      async.waterfall([
        checkIfUpdateNeeded,
        performUpdate
      ], function (err) {
        if (err) {
          console.log(err);
        }
      });
    });

    done(null, 'updated repos');
  });
};
