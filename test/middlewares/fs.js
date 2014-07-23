var fs = require("fs");

exports.walkDirectory = function (path) {
  fs.readdirSync(path).forEach(function (file) {
   if (~file.indexOf("js")) {
      require(path + "/" + file);
    }
  });
};
