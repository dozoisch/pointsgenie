var mongoose = require("mongoose");
var Event = mongoose.model("Event");
var Schedule = mongoose.model("Schedule");

exports.getForEvent = function *() {
  var schedule = yield Schedule.findOne({"event" : this.params.eventId})
  .populate("event").exec();
  if (!schedule) {
    this.throw("L'horaire de cet événement n'existe pas", 500);
  }

  this.body = { schedule : schedule };
};

exports.allocateTasks = function *() {
  if(!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }

  var hours = this.request.body.hours;
  if(!hours || typeof hours !== "object" || Object.keys(hours).length < 1) {
    this.throw("Un horaire doit contenir les plages d'heures", 400);
  }

  var event = yield Event.findById(this.params.eventId).exec();
  if (!event) {
    this.throw("L'événement n'existe pas", 500);
  }

  // @TODO SPIKE is it worth it having better handling
  var schedule = new Schedule({
    event: event,
    hours: hours,
  });
  event.isClosed = true;

  yield [schedule.save(), event.save()];

  this.status = 200;
  this.body = { schedule : schedule };
};

