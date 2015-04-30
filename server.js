"use strict";
console.log("Node version:", process.version);
require("./register-babel");
/**
 * Dependencies
 */
var koa = require("koa");
var react = require("react");
var passport = require("koa-passport");

/**
 * Config
 */
var config = require("./config/config");

/**
 * Database configuration
 */
require("./config/database")(config);

/**
 * Server
 */
var app = module.exports = koa();

require("./config/passport")(passport);

require("./config/koa")(app, passport);

// Routes
require("./src/routes")(app, passport);

// Start app
if (!module.parent) {
  app.listen(config.app.port, "localhost", function () {
    console.log("Server started, listening on port:", config.app.port);
    console.log("Environment:", config.app.env);
  });
}
