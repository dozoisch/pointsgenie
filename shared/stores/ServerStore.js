import { Store } from "flummox";

class ServerStore extends Store {
  constructor(flux) {
    super();
    this.state = {
      eventStore: 0,
      applicationStore: 0,
    };

    const eventActions = flux.getActions("event");
    this.registerAsync(eventActions.fetchUpcomingEvents,
      this.handleBeginEventStore,
      this.handleSuccessEventStore,
      this.handleFailedEventStore
    );

    const applicationActions = flux.getActions("application");
    this.registerAsync(applicationActions.fetchUserApplications,
      this.handleBeginApplicationStore,
      this.handleSuccessApplicationStore,
      this.handleFailedApplicationStore
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

  handleBeginApplicationStore() {
    this.setState(state => ({ applicationStore: ++state.applicationStore }));
  }

  handleSuccessApplicationStore() {
    this.setState(state => ({ applicationStore: --state.applicationStore }));
  }

  handleFailedApplicationStore() {
    this.setState(state => ({ applicationStore: --state.applicationStore }));
  }

  isLoaded() {
    return (!this.state.eventStore && !this.state.applicationStore);
  }
}

export default ServerStore;
