var superagent = require("superagent");

exports.get = function (url, cb) {
  superagent.get(url)
  .set("Accept", "application/json")
  .set("Content-Type", "application/json")
  .end(authCallback(cb));
};

exports.post = function(url, data, cb) {
  postPut("post", url, data, cb);
};

exports.put = function(url, data, cb) {
  postPut("put", url, data, cb);
};

function postPut(verb, url, data, cb) {
  superagent[verb](url)
  .send(data)
  .set("Accept", "application/json")
  .set("Content-Type", "application/json")
  .end(authCallback(cb));
}

// @TODO this should not be like that...
function authCallback(cb) {
  return function (err, res) {
    if (err) {
      if (err.status === 401) {
        return window.location.replace("/");
      }
      return cb(err, err.response);
    }
    return cb(err, res);
  }
}
