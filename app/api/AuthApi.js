import Api from "./Api";

class AuthApi extends Api {
  signIn(payload) {
    const URL = `${this.BASE_URL}/signin`;
    return this._doPost(URL, payload);
  }

  signOut() {
    const URL = `${this.BASE_URL}/signout`;
    return this._doPost(URL);
  }

  readAuthenticatedUser() {
    const URL = `${this.BASE_URL}/users/me`;
    return this._doGet(URL);
  }
};

export default AuthApi;
