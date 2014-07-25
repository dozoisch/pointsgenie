var mongoose = require("mongoose");
var Event = mongoose.model("Event");
var Application = mongoose.model("Application");

exports.create = function *() {
  if(!this.request.body) {
    throw new Error("Le corps de la requête est vide");
  }
  if(!this.request.body.tasks) {
    throw new Error("la requête doit contenir les postes demandés");
  }
  if(!this.request.body.availabilites) {
    throw new Error("la requête doit contenir les disponibilités");
  }

  var eventId = this.param.eventId;
  var event = yield Event.findById(eventId).exec();
  if(!event) {
    throw new Error("L'événement n'existe pas");
  }
  var application = new Application({
    user : this.passport.user,
    event : event,
    tasks : this.request.body.tasks,
    availabilites : this.request.body.availabilites,
  });
  yield application.save();
  this.status = 200;
};
