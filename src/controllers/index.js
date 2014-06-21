exports.index = function *() {
  console.log(this.request.user);
  this.body = yield this.render('index');
};

