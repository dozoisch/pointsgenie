import request from "superagent";
import ResourceApi from "./ResourceApi";
import Event from "../models/Event";

class EventApi extends ResourceApi {
  static resourceUrl = "events";
  static resourceName = {
    singular: "event",
    plural: "events",
  };
  static Resource = Event;

  readUpcoming() {
    const URL = `${this._getResourceUrl()}/upcoming`;
    return this._doGet(URL).then(res => this._multiResourceResponse(res));
  }
};

export default EventApi;
