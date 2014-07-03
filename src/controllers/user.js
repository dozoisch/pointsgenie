var User = require('mongoose').model('User');

exports.getCurrentUser = function *() {
  this.body = { user: this.passport.user };
}

exports.createUser = function *() {
  try {
    var user = new User({ data: {cip: this.params.cip}, password: this.params.password });
    user = yield user.save();
    this.redirect('/login?usercreated=1');
  } catch (err) {
    this.redirect('/login?usercreated=0');
  }
}
