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

describe("Event", function () {
  before(function (done) {
    co(function *() {
      yield userHelper.createBaseUser();
    })(done);
  });
  describe("Anonymous Calls", function () {
    it("GET /events/upcoming should return 401", function (done) {
      request.get("/events/upcoming")
      .expect(401)
      .end(done);
    });
    it("GET /events should return 401");
    it("POST /events should return 401");
  });
  describe("User Auth calls", function () {
    before(function (done) {
      async.parallel([
        function (cb) { authHelper.signAgent(request, cb); },
        function (cb) { eventHelper.createEvents(cb); }
      ], done);
    });
    it("GET /events/upcoming should return the upcoming event list", function (done) {
      request.get("/events/upcoming")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.exist(res.body);
        should.exist(res.body.events);
        res.body.events.length.should.equal(eventHelper.getUpcomingEvents().length);
        _.isEqual(res.body.events, eventHelper.getUpcomingEvents(), function(a, b) {
          return a.name === b.name;
        }).should.be.true;
        done();
      });
    });
    it("GET /events should return 403");
    it("POST /events should return 403");
  });
  describe("Admin Auth Calls", function () {
    it("GET /events/upcoming should return the upcoming event list");
    it("GET /events should return a list of all the events");
    it("POST /events should create a new event");
  });
  after(databaseHelper.dropDatabase);
});
