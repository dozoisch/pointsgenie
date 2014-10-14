"use strict";
var root = require("path").normalize(__dirname + "/..");

module.exports = {
  paths: {
    "in": {
      less: [
        root + "/src/client/less/*.less",
        root + "/node_modules/pikaday/css/pikaday.css"
      ],
      favicon: root + "/src/client/images/favicon.ico",
      jsx: root + "/src/client/**/*.jsx",
      js: root + "/src/client/**/*.js",
      app: root + "/build/app",
      adminApp: root + "/build/admin-app"
    },
    out: {
      build_info: root + "build-info.js",
      build_js: root + "/build",
      public: root + "/public",
    },
    toWatch: [root + "/src/**/*.js", root + "/config/*.js", root + "/server.js", root + "/lib/*.js"]
  }
};
