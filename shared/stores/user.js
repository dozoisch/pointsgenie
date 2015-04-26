import Fluxxor from "fluxxor";
import { CONSTANTS as ACTIONS } from "../actions/user";

const LOADING_TOKEN = {};

let UserStore = Fluxxor.createStore({
  initialize(userApi) {
    this.userApi = userApi;
    this.state = {
      users: {},
      meta: {
        loaded: false,
        error: null,
      },
    };

    this.bindActions(
      ACTIONS.READ.SINGLE_SUCCESS, this.handleUserReadSuccess,
      ACTIONS.READ.SINGLE_FAILURE, this.handleUserReadFailure,
      ACTIONS.READ.ALL_SUCCESS, this.handleUserReadAllSuccess,
      ACTIONS.READ.ALL_FAILURE, this.handleUserReadAllFailure
    );
  },

  isLoaded() {
    return this.state.meta.loaded;
  },

  loadError(userId) {
    if (userId) {
      let user = this.state.users[userId];
      return user ? user.ERROR : null;
    }
    return this.state.meta.error;
  },

  refresh() {
    this.state.users = {};
    this.state.meta.loaded = false;
    this.state.meta.error = null;
  },

  getUser(userId) {
    if (this.state.users[userId]) {
      return this.state.users[userId];
    }
    this.state.users[userId] = LOADING_TOKEN;
    this.userApi.read(userId)
      .then(
        user => this.flux.actions.userReadSuccess(userId, user),
        err => this.flux.actions.userReadFailure(userId, err)
      );
  },

  getUsers() {
    if (this.state.meta.loaded) {
      return this.state.meta.error ? error :
        Object.keys(this.state.users)
          .map(userId => this.state.users[userId]);
    }
    this.state.meta.error = null;
    this.userApi.readAll()
      .then(
        users => this.flux.actions.userReadAllSuccess(users),
        err => this.flux.actions.userReadAllFailure(err)
      );
    return LOADING_TOKEN;
  },


  handleUserReadSuccess({ userId, user }) {
    this.state.users[userId] = user;
    this.emit("change");
  },

  handleUserReadFailure({ userId, err }) {
    this.state.users[userId] = {
      ERROR: err.message,
    };
    this.emit("change");
  },

  handleUserReadAllSuccess(users) {
    this.state.meta.loaded = true;
    this.state.users[userId] = user;
    this.emit("change");
  },

  handleUserReadAllFailure(err) {
    this.meta.loaded = true;
    this.meta.error = err.message;
    this.emit("change");
  },

  serialize() {
    return JSON.stringify(this.state);
  },

  hydrate(json) {
    this.state = JSON.parse(json);
    console.log(this.state);
  },
});

UserStore.LOADING_TOKEN = LOADING_TOKEN;

export default UserStore;
