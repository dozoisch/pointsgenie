import { Actions } from "flummox";
import AuthApi from "../api/AuthApi";

const authApi = new AuthApi();

class AuthActions extends Actions {
  async signIn(payload) {
    return await authApi.signIn(payload).then(res => res.body.user);
  }

  async fetchAuthenticatedUser() {
    return await authApi.readAuthenticatedUser().then(res => res.body.user);
  }

  signOut(payload) {
    authApi.signOut();
    return true;
  }
}

export default AuthActions;
