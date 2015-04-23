import request from "superagent";
import Api from "./api";
import Event from "../models/event";

class EventApi extends Api {
};

EventApi.resourceUrl = "events";
EventApi.resourceName = {
  singular: "event",
  plural: "events",
};
EventApi.Resource = Event;

export default EventApi;
