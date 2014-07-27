exports.getNextHourDate = function () {
  var nextHourDate = new Date();
  nextHourDate.setUTCMinutes(60);
  return nextHourDate;
}
