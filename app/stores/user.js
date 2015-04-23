var request = require("../middlewares/request");

var _users = {};
var _changeListeners  = [];
var _initCalled = false;

import UserApi from "../api/user";
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
  makeAdmin: function (id) {
    userApi.makeAdmin(id).then((user) => {
      _users[id] = user;
      UserStore.notifyChange();
    });
  },
  assignPromocard: function (cip) {
    userApi.assignPromocard(cip).then((user) => {
      _users[user.id] = user;
      UserStore.notifyChange();
    });
  },
  awardPoints: function (id, data) {
    data.id = id;
    userApi.awardPoints(data).then((user) => {
      _users[id] = user;
      UserStore.notifyChange();
    });
  },

  batchAwardPoints: function (users, done = function(){}) {
    userApi.batchAwardPoints(users).then((user) => {
      _users[user.id] = user;
      UserStore.notifyChange();
      done();
    }).catch(err => {console.log(err.message); console.log(err.stack);});
  },

  fetchProfile: function (id) {
    userApi.fetchProfile(id).then((user) => {
      _users[user.id] = user;
      UserStore.notifyChange();
    });
  }
};

module.exports = UserStore;
