"use strict";
console.log("Node version:", process.version);
/**
 * Dependencies
 */
var fs = require("fs");
var koa = require("koa");
var mongoose = require("mongoose");
var react = require("react");
var passport = require("koa-passport");

/**
 * Config
 */
var config = require("./config/config");

/**
 * Connect to database
 */
mongoose.connect(config.mongo.url, function (err) {
  if (err) {
    console.error("\x1b[31m", "Could not connect to MongoDB!");
    console.log(err);
  }
});
mongoose.connection.on("error", function (err) {
  console.log("Error Mongo:");
  console.log(err);
});

/**
 * Load the models
 */
var models_path = config.app.root + "/src/models";
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf("js")) {
    require(models_path + "/" + file);
  }
});

/**
 * Server
 */
var app = module.exports = koa();

require("./config/passport")(passport);

require("./config/koa")(app, passport);

// Routes
require("./config/routes")(app, passport);

// Start app
if (!module.parent) {
  app.listen(config.app.port, "localhost", function () {
    console.log("Server started, listening on port:", config.app.port);
    console.log("Environment:", config.app.env);
  });
}
