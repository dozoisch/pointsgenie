'use strict';
var path = require('path');
var _ = require('lodash');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var base = {
  app: {
    root: path.normalize(__dirname + '/..'),
    env: env,
  }
};

var specific = {
  development: {
    app: {
      port: 3000,
      name: 'Points genie - Dev',
      keys: ['super-secret-hurr-durr'],
    },
    mongo: {
      url: 'mongodb://localhost/pointsgenie_dev',
    },
    ldap: {
      url: 'ldaps://ldap.usherbrooke.ca:636',
      base: 'ou=personnes,dc=usherbrooke,dc=ca',
      username: process.env.LDAP_USER,
      password: process.env.LDAP_PASSWORD,
    },
  },
  test: {
    app: {
      port: 3001,
      name: 'Points genie - Test realm',
      keys: ['super-secret-hurr-durr'],
    },
    mongo: {
      url: 'mongodb://localhost/pointsgenie_test',
    }
  },
  production: {
    app: {
      port: process.env.PORT || 3000,
      name: 'Points genie',
    },
    mongo: {
      url: 'mongodb://localhost/pointsgenie',
    }
  }
};

module.exports = _.merge(base, specific[env]);
