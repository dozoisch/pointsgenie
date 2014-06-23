var User = require('mongoose').model('User');
var co = require('co');

exports.localUser = function (username, password, done) {
  co(function *() {
    try {
      return yield User.passwordMatches(username, password);
    } catch (ex) {
      return null;
    }
  })(done);
};

exports.CASUser = function (profile, res, done) {
  co(function *() {
    return yield User.findOrCreateCAS(profile, res);
  })(done);
};

exports.extractCASProfile = function (parsedRes) {
  if (!parsedRes['cas:serviceResponse'] || !parsedRes['cas:serviceResponse']['cas:authenticationSuccess']) {
    throw new Error('CAS Strategy: Authentication failure', parsedRes);
  }
  var successBody = parsedRes['cas:serviceResponse']['cas:authenticationSuccess'][0];
  var profile = { 'provider': 'cas-udes', id: successBody['cas:user'][0],  };

  // Fetch rest of profile when available
  if (successBody['cas:attributes']) {
    var attributes = successBody['cas:attributes'][0];
    profile.emails = [{
      value: attributes['cas:mail'][0],
      type: 'school'
    }];
    profile.displayName = attributes['cas:cn'][0];
    profile.name = {
      givenName: attributes['cas:givenName'][0],
      familyName: attributes['cas:sn'][0],
    };
  }

  return profile;
};
