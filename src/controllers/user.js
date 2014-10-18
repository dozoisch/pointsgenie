var User = require("mongoose").model("User");
var Ldap = require("../../lib/ldap.js");
var LdapInstance = new Ldap();

exports.readAll = function *() {
  var users = yield User.find({}).sort("-meta.isAdmin data.cip").exec();
  this.body = { users: users };
};

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

exports.assignPromocard = function *() {
  var cip = this.params.cip.toLowerCase();
  if (!cip.match(/[a-z]{4}[0-9]{4}/)) {
    this.throw("Le cip est d'un format invalide");
  }
  var user = yield User.findByCip(cip).exec();
  if (!user) {
    try {
      var ldapAnswer = yield LdapInstance.searchByCipThunk(cip);
      var ldapUser = ldapAnswer[0];
      user = new User({
        data: {
          cip: cip,
          name: ldapUser.cn,
          email: ldapUser.mail,
        }
      });
    } catch (err) {
      console.error(err);
      this.throw("Aucun élève ne possède le cip fourni", 500);
    }
  } else {
    // If the user already has a promocard, just return
    if (user.data.promocard && user.data.promocard.date) {
      this.body = { user: user };
      return;
    }
  }

  user.data.promocard = {
    price: 50,
    date: new Date(),
  };
  yield user.save();

  this.body = { user: user };
};

exports.awardPoints = function *() {
  if (!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  if (!this.request.body.points) {
    this.throw("Le nombre de points doit être spécifié", 400);
  }
  var user = yield User.findById(this.params.id).exec();
  if (!user) {
    this.throw("L'usager n'existe pas", 404);
  }

  // Get current date
  var date = (new Date().toISOString().split("T"))[0];
  // @TODO export that to a module, so we can test the format
  var reason = date + ": " + this.passport.user.data.cip + " -- " + this.request.body.reason;

  user.data.points = user.data.points || [];
  user.data.points.push({
    points: this.request.body.points,
    reason: reason,
  });
  yield user.save();
  this.body = { user: user };
};

exports.getCurrentUser = function *() {
  var user = this.passport.user;
  user.data.hasPassword = user.hasPassword();
  this.body = { user: user };
};

exports.getCurrentUserPoints = function *() {
  this.body = {
    totalPoints: this.passport.user.data.totalPoints,
    points: this.passport.user.data.points,
  };
};

exports.makeAdmin = function *() {
  var user = yield User.findById(this.params.id).exec();
  if (!user) {
    this.throw("L'usager n'existe pas", 404);
  }
  user.meta.isAdmin = true;
  yield user.save();

  this.body = { user : user };
};
