/**
 * Dependencies
 */
var should = require("should");
var mongoose = require("mongoose");

var User = mongoose.model("User");

const USER_BASE_INFOS = { cip: "test1234", password: "123123123" };
const USER_PROMO_INFOS = { cip: "prom1234", password: "231231231" };
const ADMIN_BASE_INFOS = { cip: "root1234", password: "321321321" };

exports.USER_BASE_INFOS = USER_BASE_INFOS;
exports.ADMIN_BASE_INFOS = ADMIN_BASE_INFOS;
exports.USER_PROMO_INFOS = USER_PROMO_INFOS;

exports.createBaseUser = function *() {
  var user = new User({ data: {cip: USER_BASE_INFOS.cip}, password: USER_BASE_INFOS.password });
  yield user.save();
};
exports.createAdminUser = function *() {
  var user = new User({ data: { cip: ADMIN_BASE_INFOS.cip }, password: ADMIN_BASE_INFOS.password, meta: { isAdmin: true } });
  yield user.save();
};

exports.createPromocardUser = function *() {
  var user = new User({ data: { cip: USER_PROMO_INFOS.cip, promocard: { price: 50, date: Date.now() } }, password: USER_PROMO_INFOS.password });
  yield user.save();
};

exports.getUserWithCip = function *(cip) {
  var user = yield User.findByCip(cip).exec();
  if (!user) throw new Error("User not found");
  return user;
};
