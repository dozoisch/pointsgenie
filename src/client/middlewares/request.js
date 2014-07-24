var superagent = require("superagent");

exports.get = function (url, cb) {
  superagent.get(url)
  .set("Accept", "application/json")
  .set("Content-Type", "application/json")
  .end(authCallback(cb));
};

exports.post = function(url, data, cb) {
  superagent.post(url)
  .send(data)
  .set("Accept", "application/json")
  .set("Content-Type", "application/json")
  .end(authCallback(cb));
};

function authCallback(cb) {
  return function (err, res) {
    if(res.status === 401) {
      window.location.replace("/");
    } else {
      cb(err, res);
    }
  }
}
