var request = require("../middlewares/request");

var _events = {};
var _changeListeners  = [];
var _initCalled = false;

var URL = "/events";

var EventStore = {
  init: function () {
    if(_initCalled)
      return;
    _initCalled = true;
    request.get(URL, function (err, res) {
      // @TODO: add error handling
      if(res.body && res.body.event) {
        res.events.forEach(function (event) {
          _events[event.id] = event;
        });

        EventStore.notifyChange();
      }
    });
  },
  addEvent: function (event, done) {
    request.post(URL, event, function (err, res) {
      // @TODO: add error handling
      if(res.body && res.body.event) {
        var event = {
          id: res.body.event.id,
          name: res.body.event.name,
          startDate: new Date(res.body.event.startDate),
          endDate: new Date(res.body.event.endDate),
          tasks: res.body.event.tasks,
        };
        _events[res.body.event.id] = res.body.event;
        EventStore.notifyChange();

      }
      if (cb){
        cb(res.body);
      }
    });
  },
  removeEvent: function (id, done) {
    throw new Error("Not Implemented");
  },
  getEvents: function () {
    var events = [];
    Object.keys(_events).forEach(function (key) {
      events.push(_events(key));
    });
    return events;
  },
  getEvent: function (id) {
    return _events[id];
  },
  notifyChange: function() {
    _changeListeners.forEach(function (listener) {
      listener();
    });
  },
  addChangeListener: function (listener) {
    _changeListeners.push(listener);
  },
  removeChangeListener: function (listenerr) {
    _changeListeners = _changeListeners.filter(function (l) {
      return listener !== l;
    });
  },
};


module.exports = EventStore;
