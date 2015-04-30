import { model } from "mongoose";
const Application = model("Application");
const Event = model("Event");
import { getNextHourDate } from "../../lib/date-helper";

export default {
  fetchUpcomingEvents(user) {
    return Application.find({ user }, { event: 1 }).exec()
      .then(applications => applications.map(a => a.event))
      .then(applications => {
        return Event.find({
          _id: { $nin: applications },
          startDate: { $gt:  getNextHourDate()},
          isClosed: false,
        }).sort("startDate").exec();
      })
  }
};
