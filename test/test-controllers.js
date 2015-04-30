require("../register-babel");
var fsHelper = require("./middlewares/fs");
var path = require("path");

const controllerTestsPath =  path.normalize(__dirname + "/test-controllers");
describe("Controllers", function () {
  fsHelper.walkDirectory(controllerTestsPath);
});
