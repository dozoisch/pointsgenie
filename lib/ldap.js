var ldap = require("ldapjs");
var config = require("../config/config");

const MILLISECONDS_PER_MINUTE = 1000 * 60;

const TIMEOUT = MILLISECONDS_PER_MINUTE * 30; // minutes

var Ldap = function () {
  this.createClient();
};

Ldap.prototype.createClient = function (done) {
  this.client = ldap.createClient({
    url: config.ldap.url,
  });
  this.username = config.ldap.username;
  this.password = config.ldap.password;
  this._isBound = false;
  this.client.bind(this.username, this.password, function (err) {
    if (err) {
      if (typeof done === "function") {
        done(err);
      } else {
        throw err;
      }
    } else {
      this._isBound = new Date();
      if (done) {
        done();
      }
    }
  }.bind(this));
}
Ldap.prototype.destroyClient = function (done) {
  this.client.unbind(function () {
    this.client.destroy();
    if (typeof done === "function") {
      done();
    }
  }.bind(this));
}

Ldap.prototype.searchByCip = function (cip, done) {
  if (!cip) return done(new Error("ldap.searchByCip needs a cip as first argument"));
  if (!cip.match(/^[a-z]{4}\d{4}$/i)) return done(new Error("ldap.searchByCip invalid cip"));
  // Rebind after 30minutes
  if (new Date().getTime() > (this._isBound.getTime() + TIMEOUT)) {
    this.destroyClient(function (err) {
      this.createClient(function (err) {
        if (err) {
          throw err;
        }
        this._searchByCip(cip, done);
      }.bind(this));
    }.bind(this));
  } else {
    this._searchByCip(cip, done);
  }
};

Ldap.prototype._searchByCip = function (cip, done) {
  if (!done) throw new Error("ldap.searchByCip needs a callback function!");
  var entries = [];
  this.client.search("uid=" + cip + "," + config.ldap.base, function (err, res) {
    if (err) {
      return done(err);
    }

    res.on("searchEntry", function (entry) {
      entries.push(entry.object);
    });
    res.on("error", function (err) {
      done(err, entries);
    });
    res.on("end", function (result) {
      done(null, entries);
    });
  });
}

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
