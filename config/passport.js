var LocalStrategy = require("passport-local").Strategy;
var authenticator = require("../lib/authenticator");
var User = require("mongoose").model("User");
var CASStrategy = require("../lib/cas-strategy");

var serialize = function (user, done) {
  done(null, user._id);
};

var deserialize = function (id, done) {
  User.findById(id, done);
};

module.exports = function (passport) {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
  passport.use(new LocalStrategy(authenticator.localUser));

  passport.use(new CASStrategy({
      baseUrl : "https://cas.usherbrooke.ca",
      callbackUrl: "/auth/cas/callback",
      extract: authenticator.extractCASProfile,
    },
    authenticator.CASUser
  ));
};
