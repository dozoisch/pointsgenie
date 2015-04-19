var stats = require("../../build/stats.json");

var publicPath = stats.publicPath;

var STYLE_URL;
var SCRIPT_URL_COMMON;
var SCRIPT_URL_APP = publicPath + [].concat(stats.assetsByChunkName.app)[0]
var SCRIPT_URL_ADMIN = publicPath + [].concat(stats.assetsByChunkName.admin)[0];
if (process.env.NODE_ENV === "production") {
  var COMMON_CHUNK = stats.assetsByChunkName.commons;
  STYLE_URL = (publicPath + COMMON_CHUNK[1] +"?" + stats.hash);
  SCRIPT_URL_COMMON =  publicPath + COMMON_CHUNK[0] + "?" + stats.hash;
  SCRIPT_URL_APP += "?" + stats.hash;
  SCRIPT_URL_ADMIN += "?" + stats.hash;
}
console.log(stats.assetsByChunkName.app, stats.assetsByChunkName.admin);

exports.index = function *() {
  this.body = yield this.render("index", {
    user: this.passport.user,
    version: stats.appVersion,
    commit: stats.appCommit,
    STYLE_URL: STYLE_URL,
    SCRIPT_URL_COMMON: SCRIPT_URL_COMMON,
    SCRIPT_URL_APP: SCRIPT_URL_APP,
  });
};

exports.admin = function *() {
  this.body = yield this.render("admin", {
    user: this.passport.user,
    version: stats.appVersion,
    commit: stats.appCommit,
    STYLE_URL: STYLE_URL,
    SCRIPT_URL_COMMON: SCRIPT_URL_COMMON,
    SCRIPT_URL_ADMIN: SCRIPT_URL_ADMIN,
  });
};

exports.login = function *() {
  var args = {
    version: stats.appVersion,
    commit: stats.appCommit,
    STYLE_URL: STYLE_URL,
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
