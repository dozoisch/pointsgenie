/**
 * Dependencies
 */
var should = require("should");

var userHelper = require("./user");
/**
 * Constants
 */
exports.LOGIN_URL = "/signin";
exports.USER_CIP = userHelper.USER_BASE_INFOS.cip;
exports.PROMO_CIP = userHelper.USER_PROMO_INFOS.cip;
exports.ADMIN_CIP = userHelper.ADMIN_BASE_INFOS.cip;

/**
 * Utils
 */
exports.signAgent = function (agent, done) {
  sign(userHelper.USER_BASE_INFOS, agent, done);
};

exports.signPromoAgent = function(agent, done) {
  sign(userHelper.USER_PROMO_INFOS, agent, done);
};

exports.signAdminAgent = function (agent, done) {
  sign(userHelper.ADMIN_BASE_INFOS, agent, done);
};

function sign(user, agent, done) {
  agent
  .post(exports.LOGIN_URL)
  .set("Content-Type", "application/json")
  .send({ username: user.cip, password: user.password })
  .redirects(false)
  .expect(200)
  .end(function (err, res) {
    if (err) { return done(err); }
    try {
      should.exist(res.body);
      should.exist(res.body.user);
      res.body.user.cip.should.equal(user.cip);
      done();
    } catch (err) {
      done(err);
    }
  });
}
