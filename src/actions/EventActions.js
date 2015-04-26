import { Actions } from "flummox";
import { model } from "mongoose";
import { getNextHourDate } from "../../lib/date-helper.js";

const Application = model("Application");
const Event = model("Event");

function eventActionsFactory({ koaContext }) {
  class EventActions extends Actions {
    async fetchUpcomingEvents() {
      return await Application
        .find({user: koaContext.passport.user._id }, { event: 1 }).exec()
          .then(applications => applications.map(a => a.event))
          .then(applications => {
            return Event.find({
              _id: { $nin: applications },
              startDate: { $gt:  getNextHourDate()},
              isClosed: false,
            }).sort("startDate").exec();
          })
          .then(events => {
            const ret = events.map(event => event.toJSON());
            console.log("fetched", ret);
            return ret;
          });
    }
  }
  return EventActions
};


export default eventActionsFactory;
