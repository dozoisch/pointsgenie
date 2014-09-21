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
  EVENTS: "/events",
  UPCOMING: "/events/upcoming",
};

describe("Event", function () {
  before(function (done) {
    co(function *() {
      var a = userHelper.createBaseUser();
      var b = userHelper.createAdminUser();
      yield [a, b];
    })(done);
  });
  describe("Anonymous Calls", function () {
    it("GET /events/upcoming should return 401", function (done) {
      request.get(URLS.UPCOMING)
      .expect(401)
      .end(done);
    });
    it("GET /events should return 401", function (done) {
      request.get(URLS.EVENTS)
      .expect(401)
      .end(done);
    });
    it("POST /events should return 401", function (done) {
      request.post(URLS.EVENTS)
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
    it("GET /events/upcoming should return the upcoming event list", function (done) {
      request.get(URLS.UPCOMING)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.exist(res.body);
        should.exist(res.body.events);
        var upcomingEvents = eventHelper.getUpcomingEvents();
        res.body.events.length.should.equal(upcomingEvents.length);
        res.body.events.forEach(function (elem) {
          _.find(upcomingEvents, { name: elem.name }).should.not.be.undefined;
        });
        done();
      });
    });
    it("GET /events should return 403", function (done) {
      request.get(URLS.EVENTS)
      .expect(403)
      .end(done);
    });
    it("POST /events should return 403", function (done) {
      request.post(URLS.EVENTS)
      .expect(403)
      .end(done);
    });
    it("POST /events/:id should return 403", function (done) {
      request.put(URLS.EVENTS + "/123123")
      .expect(403)
      .end(done);
    });
    after(function (done) {
      databaseHelper.dropCollection("Event", done)
    });
  });
  describe("Admin Auth Calls", function () {
    before(function (done) {
      async.parallel([
        function (cb) { authHelper.signAdminAgent(request, cb); },
        eventHelper.createEvents
      ], done);
    });
    it("GET /events/upcoming should return the upcoming event list", function (done) {
      request.get(URLS.UPCOMING)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.exist(res.body);
        should.exist(res.body.events);
        var upcomingEvents = eventHelper.getUpcomingEvents();
        res.body.events.length.should.equal(upcomingEvents.length);
        res.body.events.forEach(function (elem) {
          _.find(upcomingEvents, { name: elem.name }).should.not.be.undefined;
        });
        done();
      });
    });
    it("GET /events should return a list of all the events", function (done) {
      request.get(URLS.EVENTS)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.exist(res.body);
        should.exist(res.body.events);
        var events = eventHelper.getEvents();
        res.body.events.length.should.equal(events.length);
        res.body.events.forEach(function (elem) {
          _.find(events, { name: elem.name }).should.not.be.undefined;
        });
        done();
      });
    });
    describe("POST /events", function () {
      it("Missing name should return 400");
      it("Missing tasks should return 500");
      it("Past startDate should return 500");
      it("Smaller endDate than startDate should return 500");
      it("Well formed event should return 200", function (done) {
        var startDate = new Date();
        startDate.setUTCDate(startDate.getUTCDate() + 5);
        var endDate = new Date(startDate.getTime());
        endDate.setUTCHours(endDate.getUTCHours() + 3);

        var data = {
          event : {
            name: "A superb name",
            startDate: startDate,
            endDate: endDate,
            tasks: ["task1", "task2"],
          }
        };
        request.post(URLS.EVENTS)
        .send(data)
        .expect(200)
        .end(done);
      });
    });
    describe("PUT /events/:id", function () {
      it("Body without event should return a 400", function (done) {
        request.put(URLS.EVENTS + "/NotABsonId")
        .expect(400)
        .end(done);
      });
      it("Unexisting event should return a 404", function (done) {
        request.put(URLS.EVENTS + "/NotABsonId")
        .send({ event: eventHelper.getEvents()[0] })
        .expect(404)
        .end(done);
      });
      it("Well formed update should return 200 and the event", function (done) {
        var eventToUpdate = eventHelper.getEvents()[0];
        eventToUpdate.name = eventToUpdate.name + "Updated";
        request.put(URLS.EVENTS + "/" + eventToUpdate._id)
        .send({ event: eventToUpdate})
        .expect(200)
        .end(function (err, res) {
          should.exist(res.body);
          should.exist(res.body.event);
          res.body.event.name.should.equal(eventToUpdate.name);
          done();
        });
      });
    });
  });
  after(databaseHelper.dropDatabase);
});
