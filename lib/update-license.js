var moment = require('moment');

module.exports = function (licenseContent) {
  return licenseContent.replace(/\d{4}/g, moment().format('YYYY'));
};
