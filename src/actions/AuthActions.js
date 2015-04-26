import { Actions } from "flummox";

function authActionsFactory({ koaContext }) {
  class AuthActions extends Actions {
    async fetchAuthenticatedUser() {
      if (koaContext.passport.user) {
        return await Promise.resolve(koaContext.passport.user.toJSON());
      }
      return Promise.reject("No Authenticated User");
    }

    signOut() {
      koaContext.logout();
      koaContext.session = null;
    }
  }
  return AuthActions;
};

export default authActionsFactory;
