/**
 * Dependencies
 */
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
  APPLY: "/apply",
  EVENTS: "/events/",
  EVENTS_APPLICATIONS: "/applications",
};

describe("Application", function () {
  before(function (done) {
    co(function *() {
      var toYield = [];
      toYield.push(userHelper.createBaseUser());
      toYield.push(userHelper.createAdminUser());
      toYield.push(userHelper.createPromocardUser());
      yield toYield;
    })(done);
  });
  describe("Anonymous Calls", function () {
    it("POST /apply/:eventId should return 401", function (done) {
      request.post(URLS.APPLY + "/anyId")
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
    before(function (done) {
      async.parallel([
        function (cb) { authHelper.signAgent(request, cb); },
        eventHelper.createEvents
      ], done);
    });
    it("POST /apply/:anyId should return 403 (user needs promocard)", function (done) {
      request.post(URLS.APPLY + "/anyId")
      .expect(403)
      .end(done);
    });
    it("GET /events/:id/application should return 403", function (done) {
      request.get(URLS.EVENTS + "someId" + URLS.EVENTS_APPLICATIONS)
      .expect(403)
      .end(done);
    });
    after(function (done) {
      databaseHelper.dropCollection("Event", done)
    });
  });
  describe("Promo Auth calls", function () {
    before(function (done) {
      async.parallel([
        function (cb) { authHelper.signPromoAgent(request, cb); },
        eventHelper.createEvents
      ], done);
    });
    it("POST /apply/:badId should return 500 server error", function (done) {
      var upcoming = eventHelper.getUpcomingEvents();
      var event = upcoming[0];
      var data = {
        availabilities: [
          event.startDate
        ],
      };
      request.post(URLS.APPLY + "/badId")
      .send(data)
      .expect(500)
      .end(done);
    });
    describe("POST /apply/:goodId", function () {
      it("Empty availabilities should return 400 bad request", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[0];
        var data = {
          preferredTask: event.tasks[0],
          availabilities: [
            // empty
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(400)
        .end(done);
      });
      it("Invalid availabilities should return 500", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[0];
        var data = {
          preferredTask: event.tasks[1],
          availabilities: [
            new Date(0) // 1970 timestamp
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Unexistant event should return 500", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[0];
        var data = {
          preferredTask: event.tasks[0],
          availabilities: [
            event.startDate
          ],
        };
        request.post(URLS.APPLY + "/" + 'someId')
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Closed event should return 500", function (done) {
        var events = eventHelper.getFutureClosedEvents();
        var event = events[0];
        var data = {
          preferredTask: event.tasks[0],
          availabilities: [
            event.startDate
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Past event should return 500", function (done) {
        var events = eventHelper.getPastOpenEvents();
        var event = events[0];
        var data = {
          preferredTask: event.tasks[0],
          availabilities: [
            event.startDate
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Well formed application should return 200", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[0];
        var data = {
          preferredTask: event.tasks[0],
          availabilities: [
            event.startDate
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(200)
        .end(done);
      });
    });
    it("GET /events/:id/application should return 403", function (done) {
      request.get(URLS.EVENTS + "someId" + URLS.EVENTS_APPLICATIONS)
      .expect(403)
      .end(done);
    });
    after(function (done) {
      databaseHelper.dropCollection("Event", done)
    });
  });
  describe("Admin Auth calls", function () {
    it("GET /events/:id/application should return applications and users"/*, function () {

    }*/);
  });
  after(databaseHelper.dropDatabase);
});
