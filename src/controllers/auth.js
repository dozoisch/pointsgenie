exports.login = function *() {
  this.body = yield this.render('auth');
};


exports.createUser = function *(cip, password) {
  var User = require('mongoose').model('User');
  var user = new User({cip:cip, password: password});
  try {
    yield user.save();
  } catch (err) {
    console.log(err);
  }
  this.body = {sucess:'ok'};
}
