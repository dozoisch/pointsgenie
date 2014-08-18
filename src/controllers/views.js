exports.index = function *() {
  this.body = yield this.render("index", { user: this.passport.user });
};

exports.admin = function *() {
  this.body = yield this.render("admin", { user: this.passport.user });
};
