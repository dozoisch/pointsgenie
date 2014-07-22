/**
 * Dependencies
 */
var should = require("should");
var mongoose = require("mongoose");

var User = mongoose.model("User");

const USER_BASE_INFOS = { cip: "test1234", password: "123123123" };

exports.USER_BASE_INFOS = USER_BASE_INFOS;

exports.createBaseUser = function *() {
  var user = new User({ data: {cip: USER_BASE_INFOS.cip}, password: USER_BASE_INFOS.password });
  yield user.save();
};

exports.getUserWithCip = function *(cip) {
  var user = yield User.findByCip(cip).exec();
  if (!user) throw new Error("User not found");
  return user;
};
