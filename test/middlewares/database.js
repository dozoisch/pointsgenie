var mongoose = require("mongoose");
var async = require("async");

var Models = [
  "User",
  "Event",
  "Application",
];

exports.dropDatabase = function (done) {
    async.each(Models, dropCollection, done);
};

function dropCollection (Model, done) {
    mongoose.model(Model).collection.remove(done);
}

exports.dropCollection = dropCollection;
