var superagent = require("superagent");

exports.get = function (url, cb) {
  superagent.get(url)
  .set("Content-Type", "application/json")
  .end(cb);
}
