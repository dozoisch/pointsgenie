var Event = require("mongoose").model("Event");
var dateHelper = require("../../lib/date-helper.js");

exports.getUpcomingEvents = function *() {
  var events = yield Event.find({
    endDate: { $gt:  dateHelper.getNextHourDate()},
    isClosed: false
  }, '-isClosed').sort("startDate").exec();
  this.body = { events: events };
};


exports.create = function *() {
  if (!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  if (!this.request.body.event) {
    this.throw("Le corps doit contenir un événement");
  }
  var event = new Event(this.request.body.event);

  yield event.save();
  this.body = { "event" : event };
};

exports.readAll = function *() {
  var events = yield Event.find({}).sort("-startDate").exec();
  this.body = { events: events };
};

exports.update = function *() {
  this.throw("Not implemented", 500);
};
