var xml2js = require('xml2js').parseString;
var request = require('superagent');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var urls = (function () {
  var casBase = 'https://cas.usherbrooke.ca';
  return {
    cas: {
      login: casBase + '/login',
      logout: casBase + '/logout',
      validate: casBase + '/serviceValidate'
    },
    callback: '/login/cas/cb'
  }
})();

var createCallBackURI = function (host) {
  return encodeURIComponent('http://' + host + urls.callback);
}

exports.login = function *() {
  var url = urls.cas.login + '?service=' + createCallBackURI(this.host);
  this.redirect(url);
};

exports.callback = function *() {
  var ticket = this.query.ticket;
  var url = urls.cas.validate + '?ticket=' + ticket + '&service=' + createCallBackURI(this.host);

  var response = yield new Promise(function (resolve, reject) {
    request.post(url).end(function (err, res) {
      if (err) return reject(err);
      return resolve(res);
    });
  });

  var body = yield new Promise(function(resolve, reject) {
    console.log(response.res.text);
    xml2js(response.res.text, {trim: true}, function(err, res) {
      if (err) return reject (err);
      return resolve(res);
    });
  });

  if(body['cas:serviceResponse'] && body['cas:serviceResponse']['cas:authenticationSuccess']) {
    var cip = body['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0];
    var user = yield User.findOne({ cip: cip }).exec(); // TODO CREATE USER LEL
    var err = yield this.login(user);

    if (err) {
      this.body = err;
    } else {
      return this.redirect('/');
    }
    this.status = 500;
  }
};
