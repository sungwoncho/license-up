var fs = require('fs');
var expect = require('chai').expect;

var updateLicense = require('../lib/update-license');

var MIT_2015 = fs.readFileSync('./test/fixtures/MIT/2015.txt', {encoding: 'utf8'});
var MIT_2012_2015 = fs.readFileSync('./test/fixtures/MIT/2012_2015.txt', {encoding: 'utf8'});
var MIT_2016 = fs.readFileSync('./test/fixtures/MIT/2016.txt', {encoding: 'utf8'});
var MIT_2012_2016 = fs.readFileSync('./test/fixtures/MIT/2012_2016.txt', {encoding: 'utf8'});

describe("update-license", function() {
  it("updates 2015 to 2016", function() {
    var result = updateLicense(MIT_2015);
    expect(result).to.equal(MIT_2016);
  });

  it("updates 2012-2015 to 2012-2016", function() {
    //TODO
  });
});
