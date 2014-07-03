exports.index = function *() {
  this.body = yield this.render("index", { username: this.passport.user.data.name });
};
