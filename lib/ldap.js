var ldap = require('ldapjs');
var config = require('../config/config');

function Ldap () {
  this.client = ldap.createClient({
    url: config.ldap.url,
  });
  this.username = config.ldap.username;
  this.password = config.ldap.password;
};


Ldap.prototype.searchByCip = function (cip, done) {
  if (!done) throw new Error('ldap.searchByCip needs a callback function!');
  if (!cip) return done(new Error('ldap.searchByCip needs a cip as first argument'));
  if (!cip.match(/^[a-z]{4}\d{4}$/i)) return done(new Error('ldap.searchByCip invalid cip'));

  var self = this;
  this.client.bind(this.username, this.password, function (err) {
    if (err) return done(err);

    var entries = [];
    self.client.search('uid=' + cip + ',' + config.ldap.base, function (err, res) {
      if (err) return done(err);

      res.on('searchEntry', function (entry) {
        entries.push(entry.object);
      });
      res.on('error', function (err) {
        done(err);
      });
      res.on('end', function (result) {
        self.client.unbind();
        done(null, entries);
      });
    })
  });
};


/*
 * EXAMPLE :
 * try {
 *   var entries = yield ldap.searchByCipThunk(this.passport.user.cip);
 *   console.log(entries);
 * } catch (ex) {
 *   console.log(ex);
 * }
 */
Ldap.prototype.searchByCipThunk = function (cip) {
  var self = this;
  return new Promise(function (resolve, reject) {
    self.searchByCip(cip, function (err, entry) {
      if (err) return reject(err);
      return resolve(entry);
    });
  });
};

module.exports = exports = Ldap;
