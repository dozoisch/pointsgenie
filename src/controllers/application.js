var mongoose = require("mongoose");
var Event = mongoose.model("Event");
var Application = mongoose.model("Application");
var dateHelper = require("../../lib/date-helper.js");


exports.create = function *() {
  if(!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  if(!this.request.body.tasks || Object.keys(this.request.body.tasks).length !== 3) {
    this.throw("la requête doit contenir les trois postes demandés", 400);
  }
  if(!this.request.body.availabilities || this.request.body.availabilities.length < 1) {
    this.throw("Une postulance doit contenir au moins une disponibilité", 400);
  }

  var eventId = this.params.eventId;
  var event = yield Event.findById(eventId).exec();
  if(!event) {
    this.throw("L'événement n'existe pas", 500);
  }

  if(event.closed) {
    this.throw("Impossible de postuler sur un événement fermé", 500);
  }

  if(event.endDate.getTime() < dateHelper.getNextHourDate().getTime()) {
    this.throw("Impossible de postuler sur un événement passé", 500);
  }

  if(!isValidTaskPrefs(this.request.body.tasks, event)) {
    this.throw("Les tâches demandées n'existent pas", 500);
  }

  if(!isValidAvailabilites(this.request.body.availabilities, event)) {
    this.throw("Les heures de disponibilité sont invalides");
  }

  var application = new Application({
    user: this.passport.user,
    event: event,
    tasks: this.request.body.tasks,
    availabilities: this.request.body.availabilities,
  });

  yield application.save();
  this.body = { application: "application" };
};

function isValidAvailabilites(availabilities, event) {
  for(var i = 0; i < availabilities.length; ++i) {
    availabilities = new Date(availabilities);
    if(availabilities.getTime() > event.endDate || availabilities.getTime() < event.startDate) {
      return false;
    }
  }
  return true;
}

function isValidTaskPrefs(tasks, event) {
  return isValidTask(tasks.first, event.tasks) &&
    isValidTask(tasks.second, event.tasks) &&
    isValidTask(tasks.third, event.tasks);
}

function isValidTask(task, array) {
  return task && task.length > 0 && array.indexOf(task) !== -1;
}
