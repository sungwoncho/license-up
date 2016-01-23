module.exports = function (licenseContent, done) {
  var thisYear = (new Date()).getFullYear();
  var latestYear, originalYearInfo, updatedYearInfo, match, updatedLicenseContent;


  match = licenseContent.match(/Copyright \(c\) (\d{4})\s*[~-]\s*(\d{4})/);
  if (match) {
    latestYear = match[2];

    if (parseInt(latestYear) < thisYear) {
      originalYearInfo = match[0];
      updatedYearInfo = originalYearInfo.replace(latestYear, thisYear);

      updatedLicenseContent = licenseContent
                                  .replace(originalYearInfo, updatedYearInfo);

      done(null, updatedLicenseContent, originalYearInfo, updatedYearInfo);
      return;
    }
  } else {
    match = licenseContent.match(/Copyright \(c\) (\d{4})/);
    latestYear = match[1];

    if (parseInt(latestYear) < thisYear) {
      originalYearInfo = match[0];
      updatedYearInfo = originalYearInfo + '-' + thisYear;

      updatedLicenseContent = licenseContent
                              .replace(originalYearInfo, updatedYearInfo);

      done(null, updatedLicenseContent, originalYearInfo, updatedYearInfo);
      return;
    }
  }

  // Otherwise update is not needed
  done();
};
