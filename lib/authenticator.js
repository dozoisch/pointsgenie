var User = require('mongoose').model('User');
var co = require('co');

exports.logUserIn = function (username, password, done) {
  co(function *(){
    return yield User.passwordMatches(username, password);
  })(done);
};
