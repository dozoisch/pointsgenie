var router = require("koa-router");

var viewsController = require("../src/controllers/views");
var userController = require("../src/controllers/user");
var eventController = require("../src/controllers/event");
var applicationController = require("../src/controllers/application");
var scheduleController = require("../src/controllers/schedule");

var accessRights = require("../lib/access-rights");

module.exports = function (app, passport) {
  // register functions
  app.use(router(app));

  app.get("/login", viewsController.login);
  app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?error=local"
  }));
  app.all("/logout", viewsController.logout);

  app.get("/auth/cas", passport.authenticate("cas"));
  app.all("/auth/cas/callback", passport.authenticate("cas", {
    successRedirect: "/",
    failureRedirect: "/login?error=cas"
  }));

  /******** secured routes ********/
  app.get("/", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/login");
    } else {
      yield viewsController.index.apply(this);
    }
  });

  app.get("/users/me", accessRights.isConnected, userController.getCurrentUser);
  app.post("/users/me/password", accessRights.isConnected, userController.changePassword);
  app.get("/users/me/points", accessRights.isConnected, userController.getCurrentUserPoints);

  app.get("/events/upcoming", accessRights.isConnected, accessRights.hasPromocard, eventController.getUpcomingEvents);

  app.post("/apply/:eventId/", accessRights.isConnected, accessRights.hasPromocard, applicationController.create);

  /******** admin routes ********/
  app.get("/admin", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/login");
    } else if (!this.passport.user.meta.isAdmin) {
      this.throw("Vous n'avez pas les droits pour accéder à cette page", 403);
    } else {
      yield viewsController.admin.apply(this);
    }
  });
  app.get("/users", accessRights.isConnected, accessRights.isAdmin, userController.readAll);
  app.post("/users/awardpoints", accessRights.isConnected, accessRights.isAdmin, userController.batchAwardPoints);
  app.post("/users/:id/makeadmin", accessRights.isConnected, accessRights.isAdmin, userController.makeAdmin);
  app.post("/users/:id/awardpoints", accessRights.isConnected, accessRights.isAdmin, userController.awardPoints);
  app.post("/users/:id/fetchprofile", accessRights.isConnected, accessRights.isAdmin, userController.fetchInfoFromLDAP);

  app.post("/promocard/:cip", accessRights.isConnected, accessRights.isAdmin, userController.assignPromocard);

  app.get("/events", accessRights.isConnected, accessRights.isAdmin, eventController.readAll);
  app.post("/events", accessRights.isConnected, accessRights.isAdmin, eventController.create);
  app.get("/events/:id/applications", accessRights.isConnected, accessRights.isAdmin, applicationController.readForEvent);
  app.post("/events/:id/markpointsattributed", accessRights.isConnected, accessRights.isAdmin, eventController.markPointsAttributed);

  app.put("/events/:id", accessRights.isConnected, accessRights.isAdmin, eventController.update);
  app.post("/schedules/:eventId", accessRights.isConnected, accessRights.isAdmin, scheduleController.allocateTasks);
  app.get("/schedules/:eventId", accessRights.isConnected, accessRights.isAdmin, scheduleController.getForEvent);

  app.get("/error", function *() {
    throw new Error("This is a test error!");
  });
};
