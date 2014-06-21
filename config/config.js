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
      name: 'Koa React Gulp Mongoose Mocha - Dev',
      keys: ['super-secret-hurr-durr'],
    },
    mongo: {
      url: 'mongodb://localhost/pointdegenie_dev',
    }
  },
  test: {
    app: {
      port: 3001,
      name: 'Koa React Gulp Mongoose Mocha - Test realm',
      keys: ['super-secret-hurr-durr'],
    },
    mongo: {
      url: 'mongodb://localhost/pointdegenie_test',
    }
  },
  production: {
    app: {
      port: process.env.PORT || 3000,
      name: 'Koa React Gulp Mongoose Mocha',
    },
    mongo: {
      url: 'mongodb://localhost/pointdegenie',
    }
  }
};

module.exports = _.merge(base, specific[env]);
