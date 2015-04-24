var Router = require("koa-router");

var viewsController = require("../src/controllers/views");
var userController = require("../src/controllers/user");
var eventController = require("../src/controllers/event");
var applicationController = require("../src/controllers/application");
var scheduleController = require("../src/controllers/schedule");
var authController = require("../src/controllers/auth");

var accessRights = require("../lib/access-rights");

module.exports = function (app, passport) {
  // register functions
  var router = new Router();
  app.use(router.routes());
  app.use(router.allowedMethods());

  router.get("/login", viewsController.login);
  router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login?error=local"
  }));
  router.all("/logout", viewsController.logout);

  router.get("/auth/cas", passport.authenticate("cas"));
  router.all("/auth/cas/callback", passport.authenticate("cas", {
    successRedirect: "/",
    failureRedirect: "/login?error=cas"
  }));

  router.get("/auth", authController.getCurrentUser);
  router.post("/auth", authController.signIn);
  router.all("/signout", authController.signOut);


  /******** secured routes ********/
  router.get("/", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/login");
    } else {
      yield viewsController.index.apply(this);
    }
  });

  router.get("/users/me", accessRights.isConnected, authController.getCurrentUser);
  router.post("/users/me/password", accessRights.isConnected, userController.changePassword);
  router.get("/users/me/points", accessRights.isConnected, userController.getCurrentUserPoints);

  router.get("/events/upcoming", accessRights.isConnected, accessRights.hasPromocard, eventController.getUpcomingEvents);

  router.post("/apply/:eventId/", accessRights.isConnected, accessRights.hasPromocard, applicationController.create);

  /******** admin routes ********/
  router.get("/admin", function *() {
    if (!this.isAuthenticated()) {
      this.redirect("/login");
    } else if (!this.passport.user.meta.isAdmin) {
      this.throw("Vous n'avez pas les droits pour accéder à cette page", 403);
    } else {
      yield viewsController.admin.apply(this);
    }
  });

  var adminRouter = new Router();
  app.use(adminRouter.routes());
  adminRouter.use(accessRights.isConnected, accessRights.isAdmin);
  adminRouter.get("/users", userController.readAll);
  adminRouter.post("/users/awardpoints", userController.batchAwardPoints);
  adminRouter.post("/users/:id/makeadmin", userController.makeAdmin);
  adminRouter.post("/users/:id/awardpoints", userController.awardPoints);
  adminRouter.post("/users/:id/fetchprofile", userController.fetchInfoFromLDAP);

  adminRouter.post("/promocard/:cip", userController.assignPromocard);

  adminRouter.get("/events", eventController.readAll);
  adminRouter.post("/events", eventController.create);
  adminRouter.get("/events/:id", eventController.read);
  adminRouter.get("/events/:id/applications", applicationController.readForEvent);
  adminRouter.post("/events/:id/markpointsattributed", eventController.markPointsAttributed);

  adminRouter.put("/events/:id", eventController.update);
  adminRouter.post("/schedules/:eventId", scheduleController.allocateTasks);
  adminRouter.get("/schedules/:eventId", scheduleController.getForEvent);

  router.get("/error", function *() {
    throw new Error("This is a test error!");
  });

};
