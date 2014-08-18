var router = require("koa-router");

var viewsController = require("../src/controllers/views");
var authController = require("../src/controllers/auth");
var casController = require("../src/controllers/cas");
var userController = require("../src/controllers/user");
var eventController = require("../src/controllers/event");
var applicationController = require("../src/controllers/application");

var secured = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.status = 401;
  }
};

var isAdmin = function *(next) {
  if (this.passport.user.meta.isAdmin) {
    yield next;
  } else {
    this.status = 403;
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

  // secured routes
  app.get("/", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/login");
    } else {
      yield viewsController.index.apply(this);
    }
  });

  app.get("/users/me", secured, userController.getCurrentUser);
  app.post("/users/me/password", secured, userController.changePassword);
  app.get("/users/me/points", secured, userController.getCurrentUserPoints);

  app.get("/events/upcoming", secured, eventController.getUpcomingEvents);

  app.post("/apply/:eventId/", secured, applicationController.create);

  // admin routes
  app.get("/admin", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/login");
    } else if (!this.passport.user.meta.isAdmin) {
      this.throw("Vous n'avez pas les droits pour accéder à cette page", 403);
    } else {
      yield viewsController.admin.apply(this);
    }
  });

  app.get("/events", secured, isAdmin, eventController.readAll);
  app.post("/events", secured, isAdmin, eventController.create);
  app.put("/events/:id", secured, isAdmin, eventController.update);

  app.get("/error", function *() {
    throw new Error("This is a test error!");
  });
};
