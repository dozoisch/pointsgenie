var xml2js = require("xml2js").parseString;
var request = require("superagent");
var mongoose = require("mongoose");
var User = mongoose.model("User");

var urls = (function () {
  var casBase = "https://cas.usherbrooke.ca";
  return {
    cas: {
      login: casBase + "/login",
      logout: casBase + "/logout",
      validate: casBase + "/serviceValidate"
    },
    callback: "/login/cas/cb"
  }
})();

var createCallBackURI = function (host) {
  return encodeURIComponent("http://" + host + urls.callback);
}

exports.login = function *() {
  var url = urls.cas.login + "?service=" + createCallBackURI(this.host);
  this.redirect(url);
};
