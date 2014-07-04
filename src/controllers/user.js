var User = require("mongoose").model("User");

exports.changePassword = function *() {
  if(!this.request.body) {
    throw new Error("Body is empty");
  }

  var user = this.passport.user;

  if((typeof user.data.password == "string") && (user.data.password.length > 0)) {
    var password = this.request.body.curr_pw;
    if (!password) {
      throw new Error("Current password missing");
    }
    var match = yield user.comparePassword(password);
    if (!match) {
      throw new Error("Current password mismatch");
    }
  }

  var newPassword = this.request.body.new_pw1;
  if (!newPassword || newPassword !==  this.request.body.new_pw2) {
    throw new Error("New passwords mismatch");
  }
  user.password = newPassword;
  yield user.save();
  this.status(200);
}

exports.getCurrentUser = function *() {
  var user = this.passport.user;
  user.data.hasPassword = (typeof user.data.password == "string") && (user.data.password.length > 0);
  this.body = { user: user };
}

exports.createUser = function *() {
  try {
    var user = new User({ data: {cip: this.params.cip}, password: this.params.password });
    user = yield user.save();
    this.redirect("/login?usercreated=1");
  } catch (err) {
    this.redirect("/login?usercreated=0");
  }
}
