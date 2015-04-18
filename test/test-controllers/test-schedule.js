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
  SCHEDULE: "/schedules/",
};

describe("Schedule", function () {
  before(co.wrap(function *() {
    yield [
      userHelper.createBaseUser(),
      userHelper.createAdminUser(),
    ];
  }));
  describe("Anonymous Calls", function () {
    it("POST /schedules/:anything should return 401", function (done) {
      request.post(URLS.SCHEDULE + "someId")
      .expect(401)
      .end(done);
    });
    it("GET /schedules/:anything should return 401", function (done) {
      request.get(URLS.SCHEDULE + "someId")
      .expect(401)
      .end(done);
    });
  });
  describe("User Auth calls", function () {
    before(function (done) {
      async.parallel([
        function (cb) { authHelper.signAgent(request, cb); },
      ], done);
    });
    it("POST /schedules/:anything should return 403", function (done) {
      request.post(URLS.SCHEDULE + "someId")
      .expect(403)
      .end(done);
    });
    it("GET /schedules/:anything should return 403", function (done) {
      request.get(URLS.SCHEDULE + "someId")
      .expect(403)
      .end(done);
    });
  });
  describe("Admin Auth Calls", function () {
    before(function (done) {
      async.parallel([
        function (cb) { authHelper.signAdminAgent(request, cb); },
        eventHelper.createEvents
      ], done);
    });
    describe("POST /schedules/:id", function () {
      it("Empty body should return 400", function (done) {
        request.post(URLS.SCHEDULE + "someId")
        .expect(400)
        .end(done);
      });
      it("Empty hours should return 400", function (done) {
        request.post(URLS.SCHEDULE + "someId")
        .send({hours: {}})
        .expect(400)
        .end(done);
      });
      it("badEventId should return 500", function (done) {
        var user = userHelper.getUserWithCip(userHelper.USER_BASE_INFOS.cip);
        var event = eventHelper.getUpcomingEvents()[0];
        var data = {};
        var date = new Date().getTime();
        data[date] = {};
        data[date][event.tasks[0]] = [ user._id ];
        request.post(URLS.SCHEDULE + "derppp")
        .send({ hours: data })
        .expect(500)
        .end(done);
      });
      it("Well formed should return 200 and the schedule", function (done) {
        var user = userHelper.getUserWithCip(userHelper.USER_BASE_INFOS.cip);
        var event = eventHelper.getUpcomingEvents()[0];
        var data = {};
        var date = new Date().getTime();
        data[date] = {};
        data[date][event.tasks[0]] = [ user._id ];
        request.post(URLS.SCHEDULE + event._id)
        .send({ hours: data })
        .expect(200)
        .end(done);
      });
    });
    describe("GET /schedules/:eventId", function () {
      it("Bad Event Id should return 500");
      it("Existing Event Id without schedule should return 500");
      it("Existing Event Id should return event schedule");
    });
  });
  after(databaseHelper.dropDatabase);
});
