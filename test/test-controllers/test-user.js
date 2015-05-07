/**
 * Dependencies
 */
var async = require("async");
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
  PROMOCARD: "/promocard",
  // End of urls
  MAKE_ADMIN: "/makeadmin",
  ASSIGN_POINTS: "/awardpoints",
  FETCH_PROFILE: "/fetchprofile",
};

describe("User", function () {
  beforeEach(co.wrap(function *() {
    yield [
      userHelper.createBaseUser(),
      userHelper.createAdminUser()
    ];
  }));
  describe("Anonymous calls", function () {
    describe("/users/me", function () {
      it("GET should return 401", function (done) {
        request.get(URLS.ME)
        .expect(401)
        .end(done);
      });
      it("POST should return 405", function (done) {
        request.post(URLS.ME)
        .expect(405)
        .end(done);
      });
      it("PUT should return 405", function (done) {
        request.put(URLS.ME)
        .expect(405)
        .end(done);
      });
      it("DEL should return 405", function (done) {
        request.put(URLS.ME)
        .expect(405)
        .end(done);
      });
    });
    it("/users/me/password should return 401", function (done) {
      request.post(URLS.PASSWORD)
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
    it("/users/:anyId/fetchprofile should return 401", function (done) {
      request.post(URLS.USERS + "/anyId" + URLS.FETCH_PROFILE)
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
    beforeEach(function (done) {
      authHelper.signAgent(request, done);
    });
    describe("GET /users/me", function () {
      it("should return the auth user", function (done) {
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
    });
    it("GET should return user list", function (done) {
      request.get(URLS.USERS)
      .expect(200)
      .end(function (err, res) {
        if (err) { done(err); }
        should.exist(res);
        should.exist(res.body);
        should.exist(res.body.users);
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
    describe("admin functions should return 403", function () {
      it("/users/:anyId/makeadmin", function (done) {
        request.post(URLS.USERS + "/anyId" + URLS.MAKE_ADMIN)
        .expect(403)
        .end(done);
      });
      it("/users/:anyId/awardpoints", function (done) {
        request.post(URLS.USERS + "/anyId" + URLS.ASSIGN_POINTS)
        .expect(403)
        .end(done);
      });
      it("/users/:anyId/fetchprofile", function (done) {
        request.post(URLS.USERS + "/anyId" + URLS.FETCH_PROFILE)
        .expect(403)
        .end(done);
      });
      it("/promocard/:anycip", function (done) {
        request.post(URLS.PROMOCARD + "/exem1234")
        .expect(403)
        .end(done);
      });
    });
  });
  describe("Admin Auth calls", function () {
    beforeEach(function (done) {
      async.parallel([
        function (cb) { authHelper.signAdminAgent(request, cb); }
      ], done);
    });
    describe("/users", function () {
      it("GET should return user list", function (done) {
        request.get(URLS.USERS)
        .expect(200)
        .end(function (err, res) {
          if (err) { done(err); }
          should.exist(res);
          should.exist(res.body);
          should.exist(res.body.users);
          done();
        });
      });
      it("POST should return 405", function (done) {
        request.post(URLS.USERS)
        .expect(405)
        .end(done);
      });
      it("PUT should return 405", function (done) {
        request.put(URLS.USERS)
        .expect(405)
        .end(done);
      });
      it("DEL should return 405", function (done) {
        request.put(URLS.USERS)
        .expect(405)
        .end(done);
      });
    });
    describe("POST /promocard/:cip", function () {
      it("Badly formed Cip should return a 500");
      it("Missing User, but inexistant CIP should return 500");
      it("Existing User should create the user and assign him a promocard");
      it("Missing User should create the user and give him promocard");
    });
    it("/users/:badId/makeadmin should return 500");
    it("/users/:goodId/makeadmin should make the user admin");
    describe("/user/:id/awardpoints", function () {
      it("Empty body should return 400", function (done) {
        request.post(URLS.USERS + "/anyId" + URLS.ASSIGN_POINTS)
        .expect(400)
        .end(done);
      });
      it("Missing points from body should return 400", function (done) {
        request.post(URLS.USERS + "/anyId" + URLS.ASSIGN_POINTS)
        .send({ reason: "No points" })
        .expect(400)
        .end(done);
      });
      it("Inexistant user should return 404", function (done) {
        request.post(URLS.USERS + "/badId" + URLS.ASSIGN_POINTS)
        .send({ points: 1, reason: "bad Id" })
        .expect(404)
        .end(done);
      });
      it("Existant user should give points to the user");
    });
    describe("/user/awardpoints", function () {
      it("Empty body should return 400", function (done) {
        request.post(URLS.USERS + URLS.ASSIGN_POINTS)
        .expect(400)
        .end(done);
      });
      it("Missing users from body should return 400", function (done) {
        request.post(URLS.USERS + URLS.ASSIGN_POINTS)
        .send({ "userTYPO" : {} })
        .expect(400)
        .end(done);
      });
      it("Existant users should gain points");
    });
    it("/users/:goodId/fetchprofile should complete user infos");
    it("/promocard/:cip should give a user a promocard");
  });
  afterEach(databaseHelper.dropDatabase);
});
