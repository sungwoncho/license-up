var GithubAPI = require('github');
var async = require('async');

var updateLicense = require('./update-license');

module.exports = function (token, done) {
  var github = new GithubAPI({
    version: '3.0.0',
  });

  github.authenticate({
    type: 'oauth',
    token: token
  });

  var getLicenseContent = function (repo, callback) {
    var msg = {
      user: repo.owner.login,
      repo: repo.name,
      path: 'LICENSE'
    };

    console.log('checking if', repo.name, 'needs update');

    github.repos.getContent(msg, function (err, licenseData) {
      if (err) {
        if (err.code === 404) {
          // if no license is found, simply terminate the flow
          // and move to the next repo
          console.log('Could not find the license file');
          callback();
          return;
        } else {
          callback(err);
          return;
        }
      }

      var encodedLicense = new Buffer(licenseData.content, 'base64');
      var licenseContent = encodedLicense.toString('utf8');

      var data = {
        licenseContent: licenseContent,
        sha: licenseData.sha
      };

      callback(null, data);
    });
  };

  var performUpdate = function (repo, licenseContent, sha, callback) {
    if (!repo) {
      callback();
      return;
    }

    var updatedContent = updateLicense(licenseContent);

    if (!updatedContent) {
      console.log(repo.name, 'does not need update');
      callback();
      return;
    }

    console.log('updating', repo.name);

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

      callback(null);
    });
  };

  github.repos.getAll({type: 'owner'}, function (err, repos) {
    if (err) {
      done(err);
      return;
    }

    async.eachSeries(repos, function (repo, callback) {
      getLicenseContent(repo, function (err, data) {
        if (err) {
          callback(err);
          return;
        }

        if (! data) {
          callback();
          return;
        }

        performUpdate(repo, data.licenseContent, data.sha, callback);
      });
    }, function (err) {
      if (err) {
        done(err);
      } else {
        done(null, 'updated all repos');
      }
    });
  });
};
