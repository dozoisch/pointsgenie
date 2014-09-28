var packagejson = require("../../package.json");


exports.login = function *() {
  var args = {
    version: packagejson.version,
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
