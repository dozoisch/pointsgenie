/**
 * Dependencies
 */
var should = require("should");
var app = require("../../server");
var request = require("supertest").agent(app.listen());
var databaseHelper = require("../middlewares/database");
var authHelper = require("../middlewares/authenticator");
var userHelper = require("../middlewares/user");

// support for es6 generators
var co = require("co");

describe("User", function () {
  before(function (done) {
    co(function *() {
      yield userHelper.createBaseUser();
    })(done);
  });
  describe("Anonymous calls", function () {
    it("/users/me should return 401", function (done) {
      request.get("/users/me")
      .expect(401)
      .end(done);
    });
    it("/users/me/points should return 401", function (done) {
      request.get("/users/me/points")
      .expect(401)
      .end(done);
    });
  });
  describe("Auth calls", function () {
    before(function (done) {
      authHelper.signAgent(request, done);
    });
    it("/users/me should return the auth user", function (done) {
      request.get("/users/me")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.exist(res.body);
        should.exist(res.body.user);
        res.body.user.cip.should.equal(authHelper.USER_CIP);
        done();
      });
    });
    describe("/users/me/points", function () {
      it("should return the user empty list of points", function (done) {
        request.get("/users/me/points")
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          should.exist(res.body);
          should.exist(res.body.points);
          res.body.points.length.should.equal(0);
          done();
        });
      });
      it("should return the user list with points");
    });
  });
  after(databaseHelper.dropDatabase);
});
