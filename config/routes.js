var router = require("koa-router");

var indexController = require("../src/controllers/index");
var authController = require("../src/controllers/auth");
var casController = require("../src/controllers/cas");
var userController = require("../src/controllers/user");

var secured = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
  }
};

module.exports = function (app, passport) {
  // register functions
  app.use(router(app));

  app.get("/login", authController.login);
  app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?error=local"
  }));
  app.all("/logout", authController.logout);

  app.get("/auth/cas", passport.authenticate("cas"));
  app.all("/auth/cas/callback", passport.authenticate("cas", {
    successRedirect: "/",
    failureRedirect: "/login?error=cas"
  }));

  app.get("/", function *() {
    if (this.isAuthenticated()) {
      yield indexController.index.apply(this);
    } else {
      this.redirect("/login");
    }
  });

  // secured routes
  app.get("/users/me", secured, userController.getCurrentUser);
  app.post("/users/me/password", secured, userController.changePassword);
  app.get("/users/me/points", secured, userController.getCurrentUserPoints);

  app.get("/error", function *() {
    throw new Error("This is a test error!");
  });
};
