var async = require("async");
var _ = require("lodash");
var should = require("should");
var app = require("../../server");
var request = require("supertest").agent(app.listen());
var databaseHelper = require("../middlewares/database");
var authHelper = require("../middlewares/authenticator");
var userHelper = require("../middlewares/user");
var eventHelper = require("../middlewares/event");

// support for es6 generators
var co = require("co");

const URLS = {
  APPLY: "/application",
  EVENTS: "/events/",
  EVENTS_APPLICATIONS: "/applications",
};

describe("Application", function () {
  beforeEach(co.wrap(function *() {
    yield [
      userHelper.createBaseUser(),
      userHelper.createAdminUser(),
      userHelper.createPromocardUser(),
    ];
  }));
  describe("Anonymous Calls", function () {
    it("POST /application should return 401", function (done) {
      request.post(URLS.APPLY)
      .expect(401)
      .end(done);
    });
    it("GET /events/:id/applications should return 401", function (done) {
      request.get(URLS.EVENTS + "someId" + URLS.EVENTS_APPLICATIONS)
      .expect(401)
      .end(done);
    });
  });
  describe("User Auth calls", function () {
    beforeEach(function (done) {
      async.parallel([
        function (cb) { authHelper.signAgent(request, cb); },
        eventHelper.createEvents
      ], done);
    });
    describe("unauthorized calls should return 403", function () {
      it("POST /application (user needs promocard)", function (done) {
        request.post(URLS.APPLY)
        .expect(403)
        .end(done);
      });
      it("GET /events/:id/application ", function (done) {
        request.get(URLS.EVENTS + "someId" + URLS.EVENTS_APPLICATIONS)
        .expect(403)
        .end(done);
      });
    });
    afterEach(function (done) {
      databaseHelper.dropCollection("Event", done)
    });
  });
  describe("Promo Auth calls", function () {
    beforeEach(function (done) {
      async.parallel([
        function (cb) { authHelper.signPromoAgent(request, cb); },
        eventHelper.createEvents
      ], done);
    });
    it("POST /application with bad event should return 500 server error", function (done) {
      var upcoming = eventHelper.getUpcomingEvents();
      var event = upcoming[0];
      var data = {
        event: "/badId",
        application: {
          availabilities: [
            event.startDate
          ],
        }
      };
      request.post(URLS.APPLY)
      .send(data)
      .expect(500)
      .end(done);
    });
    describe("POST /application with good event", function () {
      it("Empty availabilities should return 400 bad request", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[0];
        var data = {
          event: event._id,
          application: {
            preferredTask: event.tasks[0],
            availabilities: [
              // empty
            ],
          },
        };
        request.post(URLS.APPLY)
        .send(data)
        .expect(400)
        .end(done);
      });
      it("Invalid availabilities should return 500", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[0];
        var data = {
          event: event._id,
          application: {
            preferredTask: event.tasks[1],
            availabilities: [
              new Date(0) // 1970 timestamp
            ],
          },
        };
        request.post(URLS.APPLY)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Closed event should return 500", function (done) {
        var events = eventHelper.getFutureClosedEvents();
        var event = events[0];
        var data = {
          event: event._id,
          application: {
            preferredTask: event.tasks[0],
            availabilities: [
              event.startDate
            ],
          },
        };
        request.post(URLS.APPLY)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Past event should return 500", function (done) {
        var events = eventHelper.getPastOpenEvents();
        var event = events[0];
        var data = {
          event: event._id,
          application: {
            preferredTask: event.tasks[0],
            availabilities: [
              event.startDate
            ],
          },
        };
        request.post(URLS.APPLY)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Well formed application should return 200", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[0];
        var data = {
          event: event._id,
          application: {
            preferredTask: event.tasks[0],
            availabilities: [
              event.startDate
            ],
          },
        };
        request.post(URLS.APPLY)
        .send(data)
        .expect(200)
        .end(done);
      });
      it("user/me/applications should return user applications");
    });
    it("GET /events/:id/application should return 403", function (done) {
      request.get(URLS.EVENTS + "someId" + URLS.EVENTS_APPLICATIONS)
      .expect(403)
      .end(done);
    });
    afterEach(function (done) {
      databaseHelper.dropCollection("Event", done)
    });
  });
  describe("Admin Auth calls", function () {
    it.skip("GET /events/:id/application should return applications and users", function () {

    });
  });
  afterEach(databaseHelper.dropDatabase);
});
