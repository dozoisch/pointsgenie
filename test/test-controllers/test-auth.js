"use strict";
var should = require("should");
var app = require("../../server");
var request = require("supertest").agent(app.listen());
var databaseHelper = require("../middlewares/database");
var userHelper = require("../middlewares/user");
var authHelper = require("../middlewares/authenticator");

// support for es6 generators
var co = require("co");

var URLS = {
  authUser: "/users/me",
  signOut: "/signout",
};

describe("Auth", function () {
  before(co.wrap(function *() {
    yield userHelper.createBaseUser();
  }));
  describe("Anonymous Call", function () {
    it("should return 401", function (done) {
      request.get(URLS.authUser)
      .expect(401)
      .end(done);
    });
  });
  describe("Auth calls", function () {
    before(function (done) {
      authHelper.signAgent(request, done);
    });
    it("should return the user infos", function (done) {
      request.get(URLS.authUser)
      .expect(200)
      .end(function (err, res) {
        if (err) { return done(err); }
        should.exist(res.body);
        should.exist(res.body.user);
        should.exist(res.body.user.cip);
        done();
      });
    });

    it("should sign out");
  });

  after(function (done) { databaseHelper.dropDatabase(done); });
});
