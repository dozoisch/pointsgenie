const TEST = {
  isAdmin: function (user) {
    return (user && (user.meta.isAdmin === true));
  },
  hasPromocard: function (user) {
    return (user && user.data.promocard && user.data.promocard.date);
  },
};

exports.isConnected = function *(next) {
  if (this.isAuthenticated()) {
    yield next;
  } else {
    this.throw("Vous devez être connecté pour accédez à cette page", 401);
  }
};

exports.isAdmin = function *(next) {
  if (TEST.isAdmin(this.passport.user)) {
    yield next;
  } else {
    this.throw("Vous n'avez pas les droits suffisant pour accédez à cette page", 403);
  }
};

exports.hasPromocard = function *(next) {
  if (TEST.isAdmin(this.passport.user) || TEST.hasPromocard(this.passport.user)) {
    yield next;
  } else {
    this.throw("Vous devez posséder une promocarte pour accédez à cette page", 403);
  }
};

