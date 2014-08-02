var Event = require("mongoose").model("Event");
var dateHelper = require("../../lib/date-helper.js");

exports.getUpcomingEvents = function *() {
  var events = yield Event.find({
    endDate: { $gt:  dateHelper.getNextHourDate()},
    isClosed: false
  }, '-isClosed').exec();
  this.body = {events: events};
};
