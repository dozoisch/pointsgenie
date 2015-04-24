import request from "superagent";
import ResourceApi from "./resource-api";
import Event from "../models/event";

class EventApi extends ResourceApi {
};

EventApi.resourceUrl = "events";
EventApi.resourceName = {
  singular: "event",
  plural: "events",
};
EventApi.Resource = Event;

export default EventApi;
