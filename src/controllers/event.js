import EventApi from "../api/EventApi";
var Event = require("mongoose").model("Event");
var _ = require("lodash");

exports.getUpcomingEvents = function *() {
  const events = yield EventApi.fetchUpcomingEvents(this.passport.user._id);
  this.body = { events: events };
};

exports.create = function *() {
  if (!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  if (!this.request.body.event) {
    this.throw("Le corps doit contenir un événement", 400);
  }
  var event = new Event(this.request.body.event);

  yield event.save();
  this.body = { event: event };
};

exports.read = function *() {
  if (!this.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    this.throw("L'événement n'existe pas", 404);
  }
  var event = yield Event.findById(this.params.id).exec();
  if (!event) {
    this.throw("L'événement n'existe pas", 404);
  }
  this.body = { event: event };
}

exports.readAll = function *() {
  var events = yield Event.find({}).sort("-startDate").exec();
  this.body = { events: events };
};

exports.update = function *() {
  if (!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  if (!this.request.body.event) {
    this.throw("Le corps doit contenir un événement", 400);
  }
  if (!this.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    this.throw("L'événement n'existe pas", 404);
  }
  var event = yield Event.findById(this.params.id).exec();
  if (!event) {
    this.throw("L'événement n'existe pas", 404);
  }
  _.extend(event, this.request.body.event);
  yield event.save();
  this.body = { event: event };
};

exports.markPointsAttributed = function *() {
  if (!this.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    this.throw("L'événement n'existe pas", 404);
  }
  var event = yield Event.findById(this.params.id).exec();
  if (!event) {
    this.throw("L'événement n'existe pas", 404);
  }
  event.isPointsAttributed = true;
  yield event.save();
  this.body = { event: event };
}
