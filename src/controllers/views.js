import prerender from "../prerender";
import stats from "../../build/stats.json";

var publicPath = stats.publicPath;

var STYLE_URL;
var SCRIPT_URL_COMMON;
var SCRIPT_URL_APP = publicPath + [].concat(stats.assetsByChunkName.app)[0];
var SCRIPT_URL_ADMIN = publicPath + [].concat(stats.assetsByChunkName.admin)[0];
if (process.env.NODE_ENV === "production") {
  var COMMON_CHUNK = stats.assetsByChunkName.commons;
  STYLE_URL = (publicPath + COMMON_CHUNK[1] +"?" + stats.hash);
  SCRIPT_URL_COMMON =  publicPath + COMMON_CHUNK[0] + "?" + stats.hash;
  SCRIPT_URL_APP += "?" + stats.hash;
  SCRIPT_URL_ADMIN += "?" + stats.hash;
}

exports.index = function *() {
  try {
    const { appString, DATA } = yield prerender(this);
    this.body = yield this.render("index", {
      isAuth: !!this.passport.user,
      render: appString,
      DATA: JSON.stringify(DATA),
      version: stats.appVersion,
      commit: stats.appCommit,
      STYLE_URL: STYLE_URL,
      SCRIPT_URL_COMMON: SCRIPT_URL_COMMON,
      SCRIPT_URL_APP: SCRIPT_URL_APP,
    });
  } catch (error) {
    if (error.redirect) {
      return this.redirect(error.redirect);
    }
    throw error;
  }
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
