var mongoose = require("mongoose");
var Event = mongoose.model("Event");
var Application = mongoose.model("Application");

exports.create = function *() {
  if(!this.request.body) {
    throw new Error("Le corps de la requête est vide");
  }
  if(!this.request.body.roles) {
    throw new Error("la requête doit contenir les postes demandés");
  }
  if(!this.request.body.hours) {
    throw new Error("la requête doit contenir les disponibilités");
  }

  var eventId = this.param.eventId;
  var event = yield Event.findById(eventId).exec();
  if(!event) {
    throw new Error("L'événement n'existe pas");
  }
  var application = new Application({
    user = this.passport.user,
    event = event,
    tasksPrefs = this.request.body.tasks,
    hours = this.request.body.hours,
  });
  //this.passport.user

};
