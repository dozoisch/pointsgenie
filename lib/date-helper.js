exports.getNextHourDate = function () {
  var nextHourDate = new Date();
  nextHourDate.setUTCMinutes(60);
  return nextHourDate;
};

exports.addHours = function(date, hours) {
  date.setUTCHours(date.getUTCHours() + hours);
  return date;
};
