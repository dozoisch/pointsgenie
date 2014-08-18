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
};

describe("Event", function () {
  before(function (done) {
    co(function *() {
      yield userHelper.createBaseUser();
    })(done);
  });
  describe("Anonymous Calls", function () {
    it("POST /apply/:event should return 401", function (done) {
      request.post(URLS.APPLY + "/anyId")
      .expect(401)
      .end(done);
    });
  });
  describe("User Auth calls", function () {
    before(function (done) {
      async.parallel([
        function (cb) { authHelper.signAgent(request, cb); },
        function (cb) { eventHelper.createEvents(cb); }
      ], done);
    });
    it("POST /apply/:badId should return 500 server error", function (done) {
      var upcoming = eventHelper.getUpcomingEvents();
      var event = upcoming[1];
      var data = {
        tasks: {
          first: event.tasks[0],
          second: event.tasks[1],
          third: event.tasks[2]
        },
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
      it("Empty tasks should return 400 bad request", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[1];
        var data = {
          tasks: {
            // empty
          },
          availabilities: [
            event.startDate
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(400)
        .end(done);
      });
      it("Empty availabilities should return 400 bad request", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[1];
        var data = {
          tasks: {
            first: event.tasks[0],
            second: event.tasks[1],
            third: event.tasks[2]
          },
          availabilities: [
            // empty
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(400)
        .end(done);
      });
      it("Past or closed event should return 500");
      it("Invalid tasks should return 500", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[1];
        var data = {
          tasks: {
            first: "badTask",
            second: event.tasks[1],
            third: event.tasks[2]
          },
          availabilities: [
            event.startDate
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Invalid availabilities should return 500", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[1];
        var data = {
          tasks: {
            first: event.tasks[0],
            second: event.tasks[1],
            third: event.tasks[2]
          },
          availabilities: [
            new Date(0) // 1970 timestamp
          ],
        };
        request.post(URLS.APPLY + "/" + event._id)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("Well formed application should return 200", function (done) {
        var upcoming = eventHelper.getUpcomingEvents();
        var event = upcoming[1];
        var data = {
          tasks: {
            first: event.tasks[0],
            second: event.tasks[1],
            third: event.tasks[2]
          },
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
    it("POST /events should return 403");
  });
  after(databaseHelper.dropDatabase);
});
