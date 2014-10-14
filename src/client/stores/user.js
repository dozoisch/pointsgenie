var request = require("../middlewares/request");

var _users = {};
var _changeListeners  = [];
var _initCalled = false;

var URL = "/users";

var UserStore = {
  init: function () {
    if(_initCalled)
      return;
    _initCalled = true;
    this.fetchAll();
  },
  fetchAll: function () {
    request.get(URL, function (err, res) {
      // @TODO: add error handling
      if (res.body && res.body.users) {
        res.body.users.forEach(function (user) {
          _users[user.uid] = parseUser(user);
        });
        UserStore.notifyChange();
      }
    });
  },
  addUser: function (user, done) {
    throw new Error("Not Implemented");
  },
  updateUser: function (user, done) {
    throw new Error("Not Implemented");
  },
  removeUser: function (uid, done) {
    throw new Error("Not Implemented");
  },
  getUsers: function () {
    var users = [];
    Object.keys(_users).forEach(function (key) {
      users.push(_users[key]);
    });
    return users;
  },
  getUser: function (uid) {
    return _users[uid] || {};
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
  makeAdmin: function (uid, done) {
    request.post(URL + "/" + uid + "/makeadmin", {}, function (err, res) {
      // @TODO: add error handling
      if (res.body && res.body.user) {
        _users[uid] = parseUser(res.body.user);
        UserStore.notifyChange();
      }
      if (done){
        done(res.body);
      }
    });
  },
};

function parseUser (user) {
  return {
    uid: user.uid,
    cip: user.cip,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    created: new Date(user.created),
    points: user.points || [],
    totalPoints: user.totalPoints ? parseInt(user.totalPoints, 10) : 0,
    promocard: user.promocard || {},
  };
}

module.exports = UserStore;
