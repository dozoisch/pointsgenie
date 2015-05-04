var User = require("mongoose").model("User");

exports.readAll = function *() {
  var users = yield User.find({}).sort("-meta.isAdmin data.cip").exec();
  this.body = { users: users };
};

exports.changePassword = function *() {
  if(!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }

  var user = this.passport.user;

  if (user.hasPassword()) {
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

  this.body = { user: user };
};

exports.assignPromocard = function *() {
  var cip = this.params.cip.toLowerCase();
  if (!cip.match(/[a-z]{4}[0-9]{4}/)) {
    this.throw("Le cip est d'un format invalide");
  }
  var user = yield User.findByCip(cip).exec();
  if (!user) {
    user = new User({ data: { cip: cip } });
    try {
      yield User.fetchInfoFromLDAP(cip, user);
    } catch (err) {
      console.error(err, err.stack);
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
  if (!this.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    this.throw("L'usager n'existe pas", 404);
  }
  var user = yield User.findById(this.params.id).exec();
  if (!user) {
    this.throw("L'usager n'existe pas", 404);
  }

  user.awardPoints(this.passport.user.data.cip, this.request.body.points, this.request.body.reason);
  yield user.save();
  this.body = { user: user };
};

exports.batchAwardPoints = function *() {
  if (!this.request.body) {
    this.throw("Le corps de la requête est vide", 400);
  }
  if (!this.request.body.users) {
    this.throw("Les utilisateurs doivent être spécifiés", 400);
  }
  var userIds = Object.keys(this.request.body.users);
  var users = [];
  if (userIds.length > 0) {
    users = yield User.find({ _id: { $in : userIds} }).exec();
  }
  var promises = users.map(function (user) {
    var requestUser = this.request.body.users[user.id];
    user.awardPoints(this.passport.user.data.cip, requestUser.points, requestUser.reason);
    return user.save();
  }.bind(this));
  yield promises;
  this.body = { users: users };
}

exports.getCurrentUser = function *() {
  let user = this.passport.user;
  user.data.hasPassword = user.hasPassword();
  this.body = { user };
};

exports.makeAdmin = function *() {
  const { id } = this.params;
  let user = yield User.findById(id).exec();
  if (!user) {
    this.throw("L'usager n'existe pas", 404);
  }
  user.meta.isAdmin = true;
  yield user.save();

  this.body = { user };
};

exports.fetchInfoFromLDAP = function *() {
  const { id } = this.params;
  let user = yield User.findById(id).exec();
  if (!user) {
    this.throw("L'usager n'existe pas", 404);
  }

  try {
    yield User.fetchInfoFromLDAP(user.data.cip, user);
  } catch (err) {
    console.error(err, err.stack);
    this.throw("Aucun élève ne possède le cip fourni", 500);
  }

  yield user.save();

  this.body = { user };
};
