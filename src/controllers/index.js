exports.index = function *() {
  console.log(this.req.user);
  this.body = yield this.render('index');
};

