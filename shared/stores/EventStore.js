import BaseStore from "./BaseStore";
import Event from "../../app/models/Event";


class EventStore extends BaseStore {
  static serialize = function(state) {
    return JSON.stringify(state);
  };

  static deserialize = function(state) {
    if (state) {
      let parsed = JSON.parse(state);
      if (!parsed.events) {
        parsed.events = {};
      }
      for (let key in parsed.events) {
        const event = parsed.events[key];
        parsed.events[key] = new Event(event);
      }
      return parsed;
    }
    return null;
  };

  constructor(flux) {
    super();
    const eventActions = flux.getActions("event");
    this.registerAsync(eventActions.fetchUpcomingEvents,
      this.handleBeginFetchUpcomingEvents,
      this.handleUpcomingEvents,
      this.handleFailedFetchUpcomingEvents
    );

    this.state = {
      upcomingIds: [],
      events: {},
    };
    this.flux = flux;
  }

  getError() {
    return this.state.error;
  }

  getUpcomingEvents() {
    if (this.hasFetchedUpcomingEvents()) {
      return this.state.upcomingIds.map(id => this.state.events[id]);
    }
    if (!this.state.isLoading) {
      this.flux.getActions("event").fetchUpcomingEvents();
    }
    return [];
  }

  hasFetchedUpcomingEvents() {
    return this.state.fetchedUpcomingEvents;
  }

  handleBeginFetchUpcomingEvents() {
    this.handleBeginAsyncRequest();
    this.setState({
      fetchedUpcomingEvents: false,
    });
  }

  handleUpcomingEvents(upcomingEvents = []) {
    this.handleFinishAsyncRequest();
    let events = this.state.events;
    const upcomingIds = upcomingEvents.map((event) => {
      events[event.id] = new Event(event);
      return event.id;
    });
    this.setState({
      events,
      upcomingIds,
      fetchedUpcomingEvents: true,
      error: null,
    });
  }

  handleFailedFetchUpcomingEvents(err) {
    this.handleFinishAsyncRequest();
    this.setState({
      upcomingIds: [],
      fetchedUpcomingEvents: true,
      error: err.message,
    });
  }
}


export default EventStore;
