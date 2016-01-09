var fs = require('fs');
var expect = require('chai').expect;

var updateLicense = require('../lib/update-license');

describe("update-license", function() {
  it("updates 2015 to 2015-2016", function() {
    var yearInfo = 'Copyright (c) 2015 Sung Won Cho';
    var result = updateLicense(yearInfo);
    expect(result).to.equal('Copyright (c) 2015-2016 Sung Won Cho');
  });

  it("updates 2012-2015 to 2012-2016", function() {
    var yearInfo = 'Copyright (c) 2012-2015 Sung Won Cho';
    var result = updateLicense(yearInfo);
    expect(result).to.equal('Copyright (c) 2012-2016 Sung Won Cho');
  });
});
