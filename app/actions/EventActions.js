import { Actions } from "flummox";
import EventApi from "../api/EventApi";

const eventApi = new EventApi();

class EventActions extends Actions {
  async fetchUpcomingEvents() {
    return await eventApi.readUpcoming();
  }
}

export default EventActions;
