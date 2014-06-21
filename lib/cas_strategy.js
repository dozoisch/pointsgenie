var Strategy = require('passport-strategy').Strategy;
var util = require('util');
var _ = require('lodash');
var xml2js = require('xml2js').parseString;
var request = require('superagent');

function defaultExtract (body) {
  if(body['cas:serviceResponse'] && body['cas:serviceResponse']['cas:authenticationSuccess']) {
    return { id: body['cas:serviceResponse']['cas:authenticationSuccess'][0]['cas:user'][0] };
  } else {
    throw new Error('CAS Strategy: Authentication failure', body);
  }
};

var defaultOptions = {
  baseUrl: null,
  callbackUrl: null,
  cas: {
    urls: {
      login: '/login',
      logout: '/logout',
      validate: '/serviceValidate',
    },
    parameters: {
      ticket: 'ticket',
      service: 'service',
    }
  },
  extract: defaultExtract,
};

function CASStrategy (options, verify) {
  if(!_.isObject(options)) throw new Error('CAS Strategy needs an options parameter');
  if(!_.isFunction(verify)) throw new Error('CAS Strategy needs a verify function');
  if(!options.callbackUrl) throw new Error('CAS Strategy needs options.callbackUrl');
  if(!(options.baseUrl)) throw new Error('CAS Strategy needs options.baseUrl');

  Strategy.call(this);
  this.name = 'cas';
  this._options = _.merge({}, defaultOptions, options);
  this._verify = verify;
};

util.inherits(CASStrategy, Strategy);

CASStrategy.prototype.authenticate = function (req, options) {
  _.merge(this._options, options);
  var self = this;

  // If it's the cas provider callback
  if(req.query && req.query[this._options.cas.parameters.ticket]) {
    var url = self._options.baseUrl + self._options.cas.urls.validate
      + '?' + self._options.cas.parameters.ticket + '='
      + req.query[self._options.cas.parameters.ticket]
      + '&' + self._options.cas.parameters.service + '='
      + encodeURIComponent(req.protocol + '://' + req.host + self._options.callbackUrl);

    request.post(url, function (err, res) {
      xml2js(res.text, {trim: true}, function(err, parsedRes) {
        function verified(err, user, info) {
          if (err) { return self.error(err); }
          if (!user) { return self.fail(info); }
          self.success(user, info);
        };
        try {
          self._verify(self._options.extract(parsedRes), parsedRes, verified);
        } catch (ex) {
          self.error(ex);
        }
      });
    });
  } else { // If it's the initiating call
    var url = self._options.baseUrl + self._options.cas.urls.login
      + '?' + self._options.cas.parameters.service + '='
      + encodeURIComponent(req.protocol + '://' + req.host + self._options.callbackUrl);

    self.redirect(url);
  }
};

module.exports = CASStrategy;
