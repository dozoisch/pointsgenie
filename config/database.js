var fs = require("fs");
var mongoose = require("mongoose");

module.exports = function (config) {
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
};
