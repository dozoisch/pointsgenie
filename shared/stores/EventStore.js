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
    this.registerAsync(eventActions.fetchAllEvents,
      this.handleBeginFetchAllEvents,
      this.handleAllEvents,
      this.handleFailedFetchAllEvents
    );
    this.registerAsync(eventActions.fetchEvent,
      this.handleBeginFetchEvent,
      this.handleSingleEvent,
      this.handleFailedFetchEvent
    );

    this.register(eventActions.markEventAsPointsAttributed,
      this.handleSingleEvent
    );
    this.register(eventActions.toggleIsClosedToPublic,
      this.handleSingleEvent
    );

    this.register(eventActions.createEvent,
      this.handleSingleEvent
    );

    this.register(eventActions.updateEvent,
      this.handleSingleEvent
    );

    const applicationActions = flux.getActions("application");
    this.register(applicationActions.fetchUserApplications,
      this.handleEvents
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
    if (this.state.fetchedUpcomingEvents) {
      return this.state.upcomingIds.map(id => this.state.events[id]);
    }
    if (!this.state.isLoading) {
      this.flux.getActions("event").fetchUpcomingEvents();
    }
    return [];
  }

  getAllEvents() {
    if (this.state.fetchedAllEvents) {
      return Object.keys(this.state.events).map(id => this.state.events[id]);
    }
    if (!this.state.isLoading) {
      this.flux.getActions("event").fetchAllEvents();
    }
    return [];
  }

  getEvents(ids = []) {
    let events = {};
    ids.forEach(id => {
      events[id] = this.state.events[id];
    });
    return events;
  }

  getEvent(id) {
    if (this.state.events[id]) {
      return this.state.events[id];
    }
    if (!this.state.isLoading) {
      this.flux.getActions("event").fetchEvent(id);
    }
    return null;
  }

  handleBeginFetchUpcomingEvents() {
    this.handleBeginAsyncRequest();
    this.setState({
      fetchedUpcomingEvents: false,
    });
  }

  handleUpcomingEvents(upcomingEvents = []) {
    this.handleFinishAsyncRequest();
    let { events } = this.state;
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

  handleUpcomingEventsdleFailedFetchUpcomingEvents(err) {
    this.handleFinishAsyncRequest();
    this.setState({
      upcomingIds: [],
      fetchedUpcomingEvents: true,
      error: err.message,
    });
  }

  handleBeginFetchAllEvents() {
    this.handleBeginAsyncRequest();
    this.setState({
      fetchedAllEvents: false,
    });
  }

  handleAllEvents(events = []) {
    this.handleFinishAsyncRequest();
    let eventsMap = {};
    events.forEach(event => {
      eventsMap[event.id] = event;
    });
    this.setState({
      events: eventsMap,
      fetchedAllEvents: true,
      fetchedUpcomingEvents: false,
      error: null,
    });
  }

  handleEvents({ events }) {
    let stateEvents = this.state.events;
    events.forEach(event => {
      stateEvents[event.id] = event;
    });
    this.setState({
      events: stateEvents,
    });
  }

  handleFailedFetchAllEvents(err) {
    this.handleFinishAsyncRequest();
    this.setState({
      events: {},
      fetchedAllEvents: true,
      error: err.message,
    });
  }

  handleBeginFetchEvent() {
    this.handleBeginAsyncRequest();
  }

  handleSingleEvent(event) {
    if (this.state.isLoading) {
      this.handleFinishAsyncRequest();
    }
    let events = this.state.events;
    events[event.id] = event;
    this.setState({
      events,
    });
  }

  handleFailedFetchEvent(err) {
    this.handleFinishAsyncRequest();
    // @TODO handle event with id as error
    // let events = this.state.events;
    // events[]
    // this.setState({
    //   events: {},
    // });
  }

}


export default EventStore;
