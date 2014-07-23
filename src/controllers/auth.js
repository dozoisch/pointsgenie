exports.login = function *() {
  this.body = yield this.render("auth");
};

exports.logout = function *() {
  this.logout();
  this.session = null;
  this.redirect("/");
};
