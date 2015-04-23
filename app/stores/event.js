var request = require("../middlewares/request");

var _events = {};
var _changeListeners  = [];
var _initCalled = false;

import EventApi from "../api/event";
const eventApi = new EventApi();

var EventStore = {
  init: function () {
    if(_initCalled)
      return;
    _initCalled = true;
    this.fetchAll();
  },
  fetchAll: function () {
    return eventApi.readAll()
      .then((events) => {
        events.forEach((event) => {
          _events[event.id] = event;
        });
        EventStore.notifyChange();
    }).catch(err => {console.log(err.message); console.log(err.stack);});
  },
  refreshEvent(id) {
    return eventApi.read(id)
      .then((event) => {
        _events[id] = event;
        EventStore.notifyChange();
      });
  },
  addEvent: function (event, done = function(){}) {
    eventApi.create(event).then((event) => {
      _events[event.id] = event;
      EventStore.notifyChange();
      done();
    });
  },
  updateEvent: function (event, done = function(){}) {
    eventApi.update(event).then((event) => {
      _events[event.id] = event;
      EventStore.notifyChange();
      done();
    }).catch(err => {console.log(err.message); console.log(err.stack);});
  },
  removeEvent: function (id, done) {
    throw new Error("Not Implemented");
  },
  getEvents: function () {
    return Object.keys(_events).map(key => _events[key]);
  },
  getEvent: function (id) {
    return _events[id] || null;
  },
  notifyChange: function() {
    _changeListeners.forEach(listener => listener());
  },
  addChangeListener: function (listener) {
    _changeListeners.push(listener);
  },
  removeChangeListener: function (listener) {
    _changeListeners = _changeListeners.filter(function (l) {
      return listener !== l;
    });
  },

  // Other
  markAsPointsAttributed: function (id, done) {
    let payload = {
      id: id,
      isPointsAttributed: true,
    };
    EventStore.updateEvent(payload, done);
  },
};

module.exports = EventStore;
