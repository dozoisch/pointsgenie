import EventApi from "../api/EventApi";
import { model } from "mongoose";
import _ from "lodash";
const Event = model("Event");

export default {
  getUpcomingEvents: function *() {
    const events = yield EventApi.fetchUpcomingEvents(this.passport.user._id);
    this.body = { events: events };
  },

  create: function *() {
    if (!this.request.body) {
      this.throw("Le corps de la requête est vide", 400);
    }
    if (!this.request.body.event) {
      this.throw("Le corps doit contenir un événement", 400);
    }
    var event = new Event(this.request.body.event);

    yield event.save();
    this.body = { event: event };
  },

  read: function *() {
    const { id } = this.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      this.throw("L'événement n'existe pas", 404);
    }
    const event = yield Event.findById(id).exec();
    if (!event) {
      this.throw("L'événement n'existe pas", 404);
    }
    this.body = { event };
  },

  readAll: function *() {
    const events = yield Event.find({}).sort("-startDate").exec();
    this.body = { events };
  },

  update: function *() {
    if (!this.request.body) {
      this.throw("Le corps de la requête est vide", 400);
    }
    if (!this.request.body.event) {
      this.throw("Le corps doit contenir un événement", 400);
    }
    const { id } = this.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      this.throw("L'événement n'existe pas", 404);
    }
    let event = yield Event.findById(id).exec();
    if (!event) {
      this.throw("L'événement n'existe pas", 404);
    }
    _.extend(event, this.request.body.event);
    yield event.save();
    this.body = { event };
  },
};
