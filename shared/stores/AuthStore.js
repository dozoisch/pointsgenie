import BaseStore from "./BaseStore";
import User from "../../app/models/User";

class AuthStore extends BaseStore {
  static serialize = function(state) {
    return JSON.stringify(state);
  };

  static deserialize = function(state) {
    if (state) {
      let parsed = JSON.parse(state);
      parsed.user = parsed.user ? new User(parsed.user) : null;
      return parsed;
    }
    return null;
  };

  constructor(flux, user = null) {
    super();
    const authActions = flux.getActions("auth");
    this.registerAsync(authActions.signIn,
      this.handleBeginAsyncRequest,
      this.handleSignIn,
      this.failedSignIn
    );
    this.registerAsync(authActions.fetchAuthenticatedUser,
      this.handleBeginAsyncRequest,
      this.handleFetchAuthenticatedUser,
      this.handleErrorAsyncRequest
    );
    this.register(authActions.signOut, this.handleSignOut);
    this.register(authActions.saveAttemptedTransition, this.handleSaveAttemptedTransition);

    this.state = { user };
    this.flux = flux;
  }

  getAuthenticatedUser() {
    return this.state.user;
  }

  getError() {
    return this.state.error;
  }

  getAttemptedTransition() {
    return this.state.attemptedTransition;
  }

  handleSignIn(user) {
    this.setState({
      user: new User(user),
      error: null,
    });
  }

  failedSignIn(err) {
    this.handleErrorAsyncRequest();
    this.setState({
      error: err.message,
    });
  }

  handleSignOut() {
    this.setState({
      user: null,
    });
  }

  handleSaveAttemptedTransition(transition) {
    this.setState({
      attemptedTransition: transition
    });
  }

  handleFetchAuthenticatedUser(user) {
    this.setState({
      loaded: true,
      user: new User(user),
      error: null,
    });
  }

}

export default AuthStore;
