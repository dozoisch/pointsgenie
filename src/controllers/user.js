var User = require("mongoose").model("User");

exports.changePassword = function *() {
  if(!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }

  var user = this.passport.user;

  if(user.hasPassword()) {
    var password = this.request.body.currPw;
    if (!password || !(yield user.comparePassword(password))) {
      this.throw("Le mot de passe actuel ne correspond pas", 500);
    }
  }

  var newPassword = this.request.body.newPw1;
  if (!newPassword || newPassword !==  this.request.body.newPw2) {
    this.throw("Les nouveaux mot de passe ne correspondent pas", 400);
  }
  user.password = newPassword;
  yield user.save();
  this.status = 200;
};

exports.getCurrentUser = function *() {
  var user = this.passport.user;
  user.data.hasPassword = user.hasPassword();
  this.body = { user: user };
};

exports.getCurrentUserPoints = function *() {
  this.body = { points: this.passport.user.data.points };
};
