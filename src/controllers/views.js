var buildInfo = require("../../build-info.json");

exports.index = function *() {
  this.body = yield this.render("index", {
    user: this.passport.user,
    version: buildInfo.version,
    commit: buildInfo.commit,
  });
};

exports.admin = function *() {
  this.body = yield this.render("admin", {
    user: this.passport.user,
    version: buildInfo.version,
    commit: buildInfo.commit,
  });
};

exports.login = function *() {
  var args = {
    version: buildInfo.version,
    commit: buildInfo.commit,
  };
  if (this.query.error) {
    args.error = "Le cip ou le mot de passe est incorrect.";
  }
  this.body = yield this.render("auth", args);
};

exports.logout = function *() {
  this.logout();
  this.session = null;
  this.redirect("/");
};
