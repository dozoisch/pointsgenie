var packagejson = require("../../package.json");

exports.index = function *() {
  this.body = yield this.render("index", { user: this.passport.user, version: packagejson.version });
};

exports.admin = function *() {
  this.body = yield this.render("admin", { user: this.passport.user, version: packagejson.version });
};
