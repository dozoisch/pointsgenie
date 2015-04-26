var request = require("../middlewares/request");

var _users = {};
var _changeListeners  = [];
var _initCalled = false;

import UserApi from "../api/UserApi";
const userApi = new UserApi();

var UserStore = {
  init: function () {
    if(_initCalled)
      return;
    _initCalled = true;
    this.fetchAll();
  },
  fetchAll: function () {
    return userApi.readAll()
      .then((users) => {
        users.forEach((user) => {
          _users[user.id] = user;
        });
        UserStore.notifyChange();
    }).catch(err => {console.log(err.message); console.log(err.stack);});
  },
  addUser: function (user, done) {
    throw new Error("Not Implemented");
  },
  updateUser: function (user, done) {
    throw new Error("Not Implemented");
  },
  removeUser: function (id, done) {
    throw new Error("Not Implemented");
  },
  getUsers: function () {
    return Object.keys(_users).map(key => _users[key]);
  },
  getUser: function (id) {
    return _users[id] || {};
  },
  notifyChange: function() {
    _changeListeners.forEach(function (listener) {
      listener();
    });
  },
  addChangeListener: function (listener) {
    _changeListeners.push(listener);
  },
  removeChangeListener: function (listener) {
    _changeListeners = _changeListeners.filter(function (l) {
      return listener !== l;
    });
  },

  // Other functions
  makeAdmin: function (id, done = function(){}) {
    userApi.makeAdmin(id).then((user) => {
      _users[id] = user;
      UserStore.notifyChange();
      done();
    });
  },
  assignPromocard: function (cip, done = function(){}) {
    userApi.assignPromocard(cip).then((user) => {
      _users[user.id] = user;
      UserStore.notifyChange();
      done();
    });
  },
  awardPoints: function (id, data, done = function(){}) {
    data.id = id;
    userApi.awardPoints(data).then((user) => {
      _users[id] = user;
      UserStore.notifyChange();
      done();
    });
  },

  batchAwardPoints: function (data, done = function(){}) {
    userApi.batchAwardPoints(data)
      .then((users) => {
        users.forEach((user) => {
          _users[user.id] = user;
        });
        UserStore.notifyChange();
        done();
    }).catch(err => {console.log(err.message); console.log(err.stack);});
  },

  fetchProfile: function (id, done = function(){}) {
    userApi.fetchProfile(id).then((user) => {
      _users[user.id] = user;
      UserStore.notifyChange();
      done();
    });
  }
};

module.exports = UserStore;
