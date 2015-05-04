import { Actions } from "flummox";
import ApplicationApi from "../api/ApplicationApi";
import Application from "../models/Application";
import Event from "../models/Event";

const applicationApi = new ApplicationApi();

class ApplicationActions extends Actions {
  async applyToEvent(payload) {
    return await null;
  }

  async fetchApplication(id) {
    // return await eventApi.read(id);
    return await null;
  }

  async fetchUserApplications() {
    return await applicationApi.readForCurrentUser()
      .then(res => ({
        applications: res.body.applications.map(application => new Application(application)),
        events: res.body.events.map(event => new Event(event)),
      }));

  }

  async fetchAllEventApplications(eventId) {
    return await [];
  }
}

export default ApplicationActions;
