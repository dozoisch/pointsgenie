import { Actions } from "flummox";
import EventApi from "../api/EventApi";

const eventApi = new EventApi();

class EventActions extends Actions {
  async fetchUpcomingEvents() {
    return await eventApi.readUpcoming();
  }

  async fetchAllEvents() {
    return await eventApi.readAll();
  }

  async fetchEvent(id) {
    return await eventApi.read(id);
  }

  async markEventAsPointsAttributed(event) {
    event.isPointsAttributed = true;
    return await eventApi.update(event);
  }

  async toggleIsClosedToPublic(event) {
    event.isClosedToPublic = !event.isClosedToPublic;
    return await eventApi.update(event);
  }

  async createEvent(event) {
    return await eventApi.create(event);
  }

  async updateEvent(event) {
    return await eventApi.update(event);
  }
}

export default EventActions;
