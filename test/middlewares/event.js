/**
 * Dependencies
 */
var async = require("async");
var should = require("should");
var mongoose = require("mongoose");

var Event = mongoose.model("Event");

const defaultRoles = ["role0", "role1", "role2"];
const events = {
  past: [
    createEvent("pastEventClosed", -5, 3, defaultRoles, true),
    createEvent("pastEventOpen", -5, 2, defaultRoles, false )
  ],
  today: [
    createEvent("todayClosed", 0, 2, defaultRoles, true),
    createEvent("todayOpen", 0, 2, defaultRoles, false)
  ],
  future: [
    createEvent("futureClosed", 5, 6, defaultRoles, true),
    createEvent("futureOpen", 5, 6, defaultRoles, false)
  ],
};

exports.createEvents = function (done) {
  var eventsToCreate = [].concat(events.past, events.today, events.future);
  Event.collection.insert(eventsToCreate, done);
};

exports.getUpcomingEvents = function () {
  return [events.future[1]];
};

exports.getPastOpenEvents = function () {
  return [events.past[1]];
};

exports.getFutureClosedEvents = function () {
  return [events.future[0]];
};

exports.getEvents = function () {
  return events.past.concat(events.today, events.future);
};

function createEvent(name, startDateDaysOffset, lengthHours, roles, closed) {
  var startDate = new Date();
  startDate.setUTCDate(startDate.getUTCDate() + startDateDaysOffset);
  var endDate = new Date(startDate.valueOf());
  endDate.setUTCHours(endDate.getUTCHours() + lengthHours);
  return {
    name: name,
    startDate: startDate,
    endDate: endDate,
    tasks: roles,
    isClosed: closed
  };
};
