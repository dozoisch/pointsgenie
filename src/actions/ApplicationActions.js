import { Actions } from "flummox";
import ApplicationApi from "../api/ApplicationApi";

function applicationActionsFactory({ koaContext }) {
  class ApplicationActions extends Actions {
    async applyToEvent(payload) {
      return await null;
    }

    async fetchApplication(id) {
      // return await eventApi.read(id);
      return await null;
    }

    async fetchUserApplications() {
      const { _id } = koaContext.passport.user;
      return await ApplicationApi.fetchUserApplications(_id)
        .then(({ applications, events }) => ({
          applications: applications.map(applications => applications.toJSON()),
          events: events.map(event => event.toJSON()),
        }));
    }

    async fetchAllEventApplications(eventId) {
      return await [];
    }
  }

  return ApplicationActions;
}
export default applicationActionsFactory;
