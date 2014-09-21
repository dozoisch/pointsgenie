var mongoose = require("mongoose");
var Event = mongoose.model("Event");
var ObjectId = mongoose.Types.ObjectId;
var Application = mongoose.model("Application");
var User = mongoose.model("User");
var dateHelper = require("../../lib/date-helper.js");


exports.create = function *() {
  if(!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
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

  if(!isValidAvailabilites(this.request.body.availabilities, event)) {
    this.throw("Les heures de disponibilité sont invalides");
  }

  var application = new Application({
    user: this.passport.user,
    event: event,
    preferredTask: this.request.body.preferredTask,
    availabilities: this.request.body.availabilities,
  });

  yield application.save();
  this.body = { application: application };
};

exports.readForEvent = function *() {
  var applications = yield Application
  .find({ event: new ObjectId(this.params.id)})
  .select( "-event")
  .exec();
  var userIds = applications.map(function (element, index) {
    return element.user;
  });
  var users = [];
  if (userIds.length > 0) {
    users = yield User.find({ _id: { $in : userIds} }).exec();
  }
  this.body = {
    applications: applications,
    users: users,
  };
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
