exports.login = function *() {
  this.body = yield this.render('auth');
};


exports.createUser = function *(cip, password) {
  var User = require('mongoose').model('User');
  var user = new User({cip:cip, password: password});
  yield user.save();
  this.body = {sucess:'ok'};
}
