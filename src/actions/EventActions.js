import { Actions } from "flummox";
import EventApi from "../api/EventApi";

function eventActionsFactory({ koaContext }) {
  class EventActions extends Actions {
    async fetchUpcomingEvents() {
      return await EventApi.fetchUpcomingEvents(koaContext.passport.user._id)
        .then(events => {
          return events.map(event => event.toJSON());
        });
    }
  }
  return EventActions
};

export default eventActionsFactory;
