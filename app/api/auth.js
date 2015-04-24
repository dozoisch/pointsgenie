import request from "superagent";
import Api from "./api";

class AuthApi extends Api {
  signIn() {

  }

  signOut() {
    const URL = `${this._getBaseUrl()}/signout`
    return this._doGet(URL);
  }
};

export default AuthApi;
