module.exports = function (licenseContent) {
  var thisYear = (new Date()).getFullYear();
  var latestYear, originalYearInfo, updatedYearInfo, match;


  match = licenseContent.match(/Copyright \(c\) (\d{4})\s*[~-]\s*(\d{4})/);
  if (match) {
    latestYear = match[2];

    if (parseInt(latestYear) < thisYear) {
      originalYearInfo = match[0];
      updatedYearInfo = originalYearInfo.replace(latestYear, thisYear);

      return licenseContent.replace(originalYearInfo, updatedYearInfo);
    }
  } else {
    match = licenseContent.match(/Copyright \(c\) (\d{4})/);
    latestYear = match[1];

    if (parseInt(latestYear) < thisYear) {
      originalYearInfo = match[0];
      updatedYearInfo = originalYearInfo + '-' + thisYear;

      return licenseContent.replace(originalYearInfo, updatedYearInfo);
    }
  }

  return;
};
