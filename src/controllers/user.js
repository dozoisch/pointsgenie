var User = require("mongoose").model("User");

exports.changePassword = function *() {
  if(!this.request.body) {
    throw new Error("Le corps de la requête est vide");
  }

  var user = this.passport.user;

  if((typeof user.password == "string") && (user.password.length > 0)) {
    var password = this.request.body.currPw;
    if (!password || !(yield user.comparePassword(password))) {
      throw new Error("Le mot de passe actuel ne correspond pas");
    }
  }

  var newPassword = this.request.body.newPw1;
  if (!newPassword || newPassword !==  this.request.body.newPw2) {
    throw new Error("Les nouveaux mot de passe ne correspondent pas");
  }
  user.password = newPassword;
  yield user.save();
  this.status = 200;
}

exports.getCurrentUser = function *() {
  var user = this.passport.user;
  user.data.hasPassword = (typeof user.password == "string") && (user.password.length > 0);
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
