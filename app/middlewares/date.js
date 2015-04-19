module.exports.clone = function(date) {
  return new Date(date.valueOf());
};

module.exports.addHours = function(date, hours) {
  date.setUTCHours(date.getUTCHours() + hours);
  return date;
};


