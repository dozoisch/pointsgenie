exports.login = function *() {
  this.body = yield this.render('auth');
};

exports.createUser = function *() {
  var User = require('mongoose').model('User');
  console.log(this.params);
  try {
    var user = new User({ cip: this.params.cip, password: this.params.password });
    user = yield user.save();
    this.redirect('/login?usercreated=1');
  } catch (err) {
    this.redirect('/login?usercreated=0');
  }
}
