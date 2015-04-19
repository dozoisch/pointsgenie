"use strict";
var path = require("path");
var _ = require("lodash");

var env = process.env.NODE_ENV = process.env.NODE_ENV || "development";

var base = {
  app: {
    root: path.normalize(__dirname + "/.."),
    env: env,
  },
  ldap: {
    url: "ldaps://ldap.usherbrooke.ca:636",
    base: "ou=personnes,dc=usherbrooke,dc=ca",
    username: process.env.LDAP_USER,
    password: process.env.LDAP_PASSWORD,
  },
};

var specific = {
  development: {
    app: {
      port: 3000,
      name: "Points genie - Dev",
      keys: ["super-secret-hurr-durr"],
      proxy: true,
    },
    mongo: {
      url: "mongodb://localhost/pointsgenie_dev",
    },
  },
  test: {
    app: {
      port: 3001,
      name: "Points genie - Test realm",
      keys: ["super-secret-hurr-durr"],
    },
    mongo: {
      url: "mongodb://localhost/pointsgenie_test",
    },
    ldap: {
      url: "ldaps://example.com",
      base: "base",
      username: "dummy",
      password: "dummy",
    },
  },
  production: {
    app: {
      port: process.env.PORT || 3000,
      name: "Points genie",
      proxy: true,
      keys: ["super-secret-hurr-durr"],
    },
    mongo: {
      url: "mongodb://localhost/pointsgenie",
    }
  }
};

module.exports = _.merge(base, specific[env]);
