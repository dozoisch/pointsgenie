/**
 * Dependencies
 */
var should = require("should");

var userHelper = require("./user");
/**
 * Constants
 */
exports.LOGIN_URL = "/login";
exports.USER_CIP = userHelper.USER_BASE_INFOS.cip;

/**
 * Utils
 */
exports.signAgent = function (agent, done) {
  agent
  .post(exports.LOGIN_URL)
  .set("Content-Type", "application/json")
  .send({ username: userHelper.USER_BASE_INFOS.cip, password: userHelper.USER_BASE_INFOS.password })
  .redirects(false)
  .expect(302)
  .end(function (err, res) {
    if(err) done(err);
    try {
      res.headers.location.should.equal("/");
      done();
    } catch (err) {
      done(err);
    }
  });
};
