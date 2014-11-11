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

const URLS = {
  USERS: "/users",
  ME: "/users/me",
  PASSWORD: "/users/me/password",
  POINTS: "/users/me/points",
  PROMOCARD: "/promocard",
  // End of urls
  MAKE_ADMIN: "/makeadmin",
  ASSIGN_POINTS: "/awardpoints",
};

describe("User", function () {
  before(function (done) {
    co(function *() {
      yield userHelper.createBaseUser();
    })(done);
  });
  describe("Anonymous calls", function () {
    it("/users/me should return 401", function (done) {
      request.get(URLS.ME)
      .expect(401)
      .end(done);
    });
    it("/users/me/password should return 401", function (done) {
      request.post(URLS.PASSWORD)
      .expect(401)
      .end(done);
    });
    it("/users/me/points should return 401", function (done) {
      request.get(URLS.POINTS)
      .expect(401)
      .end(done);
    });
    it("/users should return 401", function (done) {
      request.get(URLS.USERS)
      .expect(401)
      .end(done);
    });
    it("/users/:anyId/makeadmin should return 401", function (done) {
      request.post(URLS.USERS + "/anyId" + URLS.MAKE_ADMIN)
      .expect(401)
      .end(done);
    });
    it("/users/:anyId/awardpoints should return 401", function (done) {
      request.post(URLS.USERS + "/anyId" + URLS.ASSIGN_POINTS)
      .expect(401)
      .end(done);
    });
    it("/promocard/:anycip should return 401", function (done) {
      request.post(URLS.PROMOCARD + "/exem1234")
      .expect(401)
      .end(done);
    });
  });
  describe("Auth calls", function () {
    before(function (done) {
      authHelper.signAgent(request, done);
    });
    it("/users/me should return the auth user", function (done) {
      request.get(URLS.ME)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        should.exist(res.body);
        should.exist(res.body.user);
        res.body.user.cip.should.equal(authHelper.USER_CIP);
        done();
      });
    });
    describe("POST /users/me/password", function () {
      it("wrong password should return 500 server error", function (done) {
        var newPw = "newPassword123";
        var data = {
          currPw: userHelper.USER_BASE_INFOS.password + "obviously_bad_string",
          newPw1: newPw,
          newPw2: newPw,
        };
        request.post(URLS.PASSWORD)
        .send(data)
        .expect(500)
        .end(done);
      });
      it("new password that is badly repeated should return 400 bad request", function (done) {
        var newPw = "newPassword123";
        var data = {
          currPw: userHelper.USER_BASE_INFOS.password,
          newPw1: newPw,
          newPw2: newPw + "BadString",
        };
        request.post(URLS.PASSWORD)
        .send(data)
        .expect(400)
        .end(done);
      });
      it("valid request should change user password", function (done) {
        var newPw = "newPassword123";
        var data = {
          currPw: userHelper.USER_BASE_INFOS.password,
          newPw1: newPw,
          newPw2: newPw,
        };
        request.post(URLS.PASSWORD)
        .send(data)
        .expect(200)
        .end(done);
      });
    });
    describe("GET /users/me/points", function () {
      it("should return the user empty list of points", function (done) {
        request.get(URLS.POINTS)
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
    it("/users should return 403", function (done) {
      request.get(URLS.USERS)
      .expect(403)
      .end(done);
    });
    it("/users/:anyId/makeadmin should return 403", function (done) {
      request.post(URLS.USERS + "/anyId" + URLS.MAKE_ADMIN)
      .expect(403)
      .end(done);
    });
    it("/users/:anyId/awardpoints should return 403", function (done) {
      request.post(URLS.USERS + "/anyId" + URLS.ASSIGN_POINTS)
      .expect(403)
      .end(done);
    });
    it("/promocard/:anycip should return 403", function (done) {
      request.post(URLS.PROMOCARD + "/exem1234")
      .expect(403)
      .end(done);
    });
  });
  describe("Admin Auth calls", function () {
    it("/users should return user list");
    describe("POST /promocard/:cip", function () {
      it("Badly formed Cip should return a 500");
      it("Missing User, but inexistant CIP should return 500");
      it("Existing User should create the user and assign him a promocard");
      it("Missing User should create the user and give him promocard");
    });
    it("/users/:badId/makeadmin should return 500");
    it("/users/:goodId/makeadmin should make the user admin");
    it("/users/:badId/awardpoints should return 500");
    it("/users/:goodId/awardpoints should give points to the user");
    it("/promocard/:cip should give a user a promocard");
  });
  after(databaseHelper.dropDatabase);
});
