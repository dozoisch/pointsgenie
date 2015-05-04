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
  ROOT: "/",
  ADMIN: "/admin",
};

describe("Views", function () {
  before(co.wrap(function *() {
    yield [
      userHelper.createBaseUser(),
      userHelper.createAdminUser(),
    ];
  }));
  describe("Anonymous calls", function () {
    it("/ should return 302 to login", function (done) {
      request.get(URLS.ROOT)
      .expect(302)
      .end(function (err, res) {
        if(err) return done(err);
        res.headers.location.should.startWith("/a/login");
        done();
      });
    });
    it("/admin should return 302 to login", function (done) {
      request.get(URLS.ADMIN)
      .expect(302)
      .end(function (err, res) {
        if(err) return done(err);
        res.headers.location.should.equal("/a/login");
        done();
      });
    });
  });
  describe("Auth calls", function () {
    before(function (done) {
      authHelper.signAgent(request, done);
    });
    it("/ should render the page", function (done) {
      request.get(URLS.ROOT)
      .expect(200)
      .end(done);
    });
    it("/admin should return 403", function (done) {
      request.get(URLS.ADMIN)
      .expect(403)
      .end(done);
    });
  });
  describe("Admin Auth calls", function () {
    before(function (done) {
      authHelper.signAdminAgent(request, done);
    });
    it("/ should render the page", function (done) {
      request.get(URLS.ROOT)
      .expect(200)
      .end(done);
    });
    it("/admin should render the page", function (done) {
      request.get(URLS.ADMIN)
      .expect(200)
      .end(done);
    });
  });
  after(databaseHelper.dropDatabase);
});
