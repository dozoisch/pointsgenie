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

function authCallback(cb) {
  return function (err, res) {
    if(res.status === 401) {
      window.location.replace("/");
    } else {
      cb(err, res);
    }
  }
}
