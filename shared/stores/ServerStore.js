import { Store } from "flummox";

class ServerStore extends Store {
  constructor(flux) {
    super();
    this.state = {
      eventStore: 0,
      authStore: 0,
    };
    const eventActions = flux.getActions("event");
    this.registerAsync(eventActions.fetchUpcomingEvents,
      this.handleBeginEventStore,
      this.handleSuccessEventStore,
      this.handleFailedEventStore
    );
    this.flux = flux;
  }

  handleBeginEventStore() {
    this.setState(state => ({ eventStore: ++state.eventStore }));
  }

  handleSuccessEventStore() {
    this.setState(state => ({ eventStore: --state.eventStore }));
  }

  handleFailedEventStore() {
    this.setState(state => ({ eventStore: --state.eventStore }));
  }

  isLoaded() {
    return (!this.state.eventStore && !this.state.authStore);
  }
}

export default ServerStore;
