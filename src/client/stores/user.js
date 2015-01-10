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
      if (!err && res.body && res.body.users) {
        res.body.users.forEach(function (user) {
          _users[user.id] = parseUser(user);
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
  removeUser: function (id, done) {
    throw new Error("Not Implemented");
  },
  getUsers: function () {
    var users = [];
    Object.keys(_users).forEach(function (key) {
      users.push(_users[key]);
    });
    return users;
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
  makeAdmin: function (id, done) {
    this._postAndHandleResponse(URL + "/" + id + "/makeadmin", {}, done);
  },
  assignPromocard: function (cip, done) {
    this._postAndHandleResponse("/promocard/" + cip, {}, done);
  },
  awardPoints: function (id, data, done) {
    this._postAndHandleResponse(URL + "/" + id + "/awardpoints", data, done);
  },
  fetchProfile: function (id, done) {
    this._postAndHandleResponse(URL + "/" + id + "/fetchprofile", {}, done);
  },
  _postAndHandleResponse: function (url, data, done) {
    request.post(url, data, function(err, res) {
      // @TODO: add error handling
      if (!err && res.body && res.body.user) {
        _users[res.body.user.id] = parseUser(res.body.user);
        UserStore.notifyChange();
      }
      if (done) {
        done(err, res);
      }
    }.bind(this));
  }
};

function parseUser (user) {
  return {
    id: user.id,
    cip: user.cip,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    created: new Date(user.created),
    points: user.points || [],
    totalPoints: user.totalPoints ? parseFloat(user.totalPoints, 10) : 0,
    promocard: user.promocard || {},
  };
}

module.exports = UserStore;
