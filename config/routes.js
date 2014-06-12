var router = require('koa-route');

var countController = require('../src/controllers/count');
var indexController = require('../src/controllers/index');
var authController = require('../src/controllers/auth');

module.exports = function (app, passport) {

  app.use(router.get('/login', authController.login));
  app.use(router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login?error=1'
  })));

  app.use(router.get('/user/:cip/:password', authController.createUser));

  app.use(function*(next) {
    if (this.isAuthenticated()) {
      yield next
    } else {
      this.redirect('/login')
    }
  })

  app.use(router.get('/', indexController.index));
  app.use(router.get('/value', countController.getCount));
  app.use(router.get('/inc', countController.increment));
  app.use(router.get('/dec', countController.decrement));
}
