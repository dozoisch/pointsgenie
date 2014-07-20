/**
 * Dependencies
 */
var should = require("should");
var app = require("../../server");
var request = require("supertest").agent(app.listen());
var databaseHelper = require("../middlewares/database");
var authHelper = require("../middlewares/authenticator");

// support for es6 generators
var co = require("co");

describe("User", function () {
  before(function (done) {
    co(function *() {
      yield authHelper.createUser();
    })(done);
  });
  describe("Anonymous calls", function () {
    it("/user/me should return 401", function (done) {
      request.get("/user/me")
      .expect(401)
      .end(done);
    });
  });
  describe("Auth calls", function () {
    before(function (done) {
      authHelper.signAgent(request, done);
    });
    it("/user/me should return the auth user", function (done) {
      request.get("/user/me")
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.exist(res.body);
        should.exist(res.body.user);
        res.body.user.cip.should.equal(authHelper.USER_CIP);
        done();
      });
    });
  });
  after(databaseHelper.dropDatabase);
});
