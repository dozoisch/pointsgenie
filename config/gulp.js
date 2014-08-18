"use strict";
var root = require("path").normalize(__dirname + "/..");

module.exports = {
  paths: {
    "in": {
      less: [
        root + "/src/client/less/*.less",
        root + "/node_modules/pikaday/css/pikaday.css"
      ],
      jsx: root + "/src/client/**/*.jsx",
      js: root + "/src/client/**/*.js",
      app: root + "/build/app",
      adminApp: root + "/build/admin-app"
    },
    out: {
      build_js: root + "/build",
      public_js: root + "/public/js",
      public_css: root + "/public/css"
    },
    toWatch: [root + "/src/**/*.js", root + "/config/*.js", root + "/server.js", root + "/lib/*.js"]
  }
};
