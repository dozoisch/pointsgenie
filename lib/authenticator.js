var User = require('mongoose').model('User');
var co = require('co');

exports.localUser = function (username, password, done) {
  co(function *() {
    return yield User.passwordMatches(username, password);
  })(done);
};

exports.CASUser = function (profile, res, done) {
  co(function *() {
    return yield User.findOrCreateCAS(profile, res);
  })(done);
}
