import { Flummox } from "flummox";
import AuthStore from "./stores/AuthStore";
import EventStore from "./stores/EventStore";
import ApplicationStore from "./stores/ApplicationStore";

export default class Flux extends Flummox {
  constructor(actions, currentUser) {
    super();
    this.createActions("auth", actions.AuthActions);
    this.createActions("event", actions.EventActions);
    this.createActions("application", actions.ApplicationActions);
    this.createStore("auth", AuthStore, this, currentUser);
    this.createStore("event", EventStore, this);
    this.createStore("application", ApplicationStore, this);
  }
}
