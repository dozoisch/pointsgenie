var path = require("path");
var serve = require("koa-static-cache");
var session = require("koa-generic-session");
var responseTime = require("koa-response-time");
var logger = require("koa-logger");
var views = require("co-views");
var compress = require("koa-compress");
var errorHandler = require("koa-error");
var bodyParser = require("koa-bodyparser");
var MongoStore = require("koa-sess-mongo-store");

var config = require("./config");

var STATIC_FILES_MAP = {};
var SERVE_OPTIONS = { maxAge: 365 * 24 * 60 * 60 };

module.exports = function (app, passport) {
  if(!config.app.keys) throw new Error("Please add session secret key in the config file!");
  app.keys = config.app.keys;

  app.proxy = config.app.proxy || false;
  if(config.app.env === "development") {
    app.use(logger());
  }

  app.use(errorHandler({
    template: config.app.root + "/src/views/error.html"
  }));

  app.use(serve(path.join(config.app.root, "app/images"), SERVE_OPTIONS, STATIC_FILES_MAP));
  if (config.app.env === "production") {
    serve(path.join(config.app.root, "build", "public"), SERVE_OPTIONS, STATIC_FILES_MAP);
  }

  app.use(session({
    key: "pointdegenie.sid",
    store: new MongoStore({ url: config.mongo.url }),
  }));
  app.use(bodyParser());
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(function *(next) {
    this.render = views(config.app.root + "/src/views", {
      map: { html: "swig" },
      cache : config.app.env === "development" ?  "memory" : false
    });
    yield next;
  });

  app.use(compress());
  app.use(responseTime());
};
