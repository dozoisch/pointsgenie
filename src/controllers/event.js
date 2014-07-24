var Event = require("mongoose").model("Event");

exports.postulate = function *() {
  // this.passport.user
};

exports.getUpcomingEvents = function *() {
  var events = yield Event.find({
    endDate: { $gt:  getNextHourDate()},
    closed: false
  }, '-closed').exec();
  this.body = {events: events};
};

function getNextHourDate() {
  var nextHourDate = new Date();
  nextHourDate.setUTCMinutes(60);
  return nextHourDate;
}
