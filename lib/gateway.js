var GithubAPI = require('github');
var async = require('async');
var inquirer = require('inquirer');
var colors = require('colors/safe');

var updateLicense = require('./update-license');

module.exports = function (token, done) {
  var github = new GithubAPI({
    version: '3.0.0',
  });

  github.authenticate({
    type: 'oauth',
    token: token
  });

  var updatedRepoNames = [];

  var getLicenseContent = function (repo, callback) {
    var license_found = false;
    var count = 0;
    var license_filenames = [
      'LICENSE',
      'LICENCE',
      'MIT-LICENSE',
      'MIT-LICENCE',
      'MIT_LICENSE',
      'MIT_LICENCE',
      'licence',
      'license'
    ];

    console.log(colors.blue('\n######### Repo: %s #########'), repo.name);
    console.log('Discovering the license file...');

    async.until(function () {
      return license_found || license_filenames.length <= count;
    }, function (n) {
      var filename = license_filenames[count];
      var msg = {
        user: repo.owner.login,
        repo: repo.name,
        path: filename
      };

      github.repos.getContent(msg, function (err, licenseData) {
        count++;

        if (err) {
          if (err.code === 404) {
            // if no license is found, simply terminate the flow
            // and move to the next repo
            n();
            return;
          } else {
            n(err);
            return;
          }
        }

        // If no error, license is found
        license_found = true;

        var encodedLicense = new Buffer(licenseData.content, 'base64');
        var licenseContent = encodedLicense.toString('utf8');

        var data = {
          licenseFilename: filename,
          licenseContent: licenseContent,
          sha: licenseData.sha
        };

        n(null, data);
      });
    }, function (err, data) {
      if (err) {
        console.log('Error occurred while getting the license content');
        callback(err);
        return;
      }

      if (!license_found) {
        console.log(colors.yellow('License was not found for this repo'));
        console.log('supported filenames are: %s', license_filenames.join(', '));
      }

      callback(null, data);
    });
  };

  var performUpdate = function (repo, licenseFilename, licenseContent, sha, callback) {
    if (!repo) {
      callback();
      return;
    }

    updateLicense(licenseContent, function (err, updatedContent, originalYear, updatedYear) {
      if (!updatedContent) {
        console.log(colors.blue("The license is already up to date"));
        callback();
        return;
      }

      console.log(colors.yellow("The license is out-of-date"));
      console.log(colors.blue("Let's update"), colors.yellow(originalYear),
                  colors.blue("to"), colors.yellow(updatedYear));

      inquirer.prompt([
        {
          name: 'update',
          type: 'confirm',
          message: "update the license",
          default: false
        }
      ], function (answers) {
        if (answers.update) {
          var encodedContent = (new Buffer(updatedContent)).toString('base64');

          var msg = {
            user: repo.owner.login,
            repo: repo.name,
            path: licenseFilename,
            message: 'Update the year',
            content: encodedContent,
            sha: sha
          };
          github.repos.updateFile(msg, function (err, res) {
            if (err) {
              callback(err);
              return;
            }

            updatedRepoNames.push(repo.name);
            callback();
          });
        } else {
          callback();
        }
      });
    });
  };


  console.log(colors.blue('------- Github License Updater -------'));
  console.log('');

  github.repos.getAll({type: 'owner'}, function (err, repos) {
    if (err) {
      done(err);
      return;
    }

    console.log(colors.blue('Found %d repositories...'), repos.length);

    async.eachSeries(repos, function (repo, callback) {
      if (repo.fork) {
        callback();
        return;
      }

      getLicenseContent(repo, function (err, data) {
        if (err) {
          callback(err);
          return;
        }

        if (! data) {
          callback();
          return;
        }

        performUpdate(repo, data.licenseFilename, data.licenseContent, data.sha, callback);
      });
    }, function (err) {
      if (err) {
        done(err);
      } else {
        done(null, {
          updatedRepoNames: updatedRepoNames
        });
      }
    });
  });
};
