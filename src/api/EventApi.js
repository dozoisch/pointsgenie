import { model, Types } from "mongoose";
const Application = model("Application");
const Event = model("Event");
const { ObjectId } = Types;

import { getNextHourDate } from "../../lib/date-helper";

export default {
  fetchUpcomingEvents(user) {
    return Application.find({ user }, { event: 1 }).exec()
      .then(applications => applications.map(a => a.event))
      .then(events => {
        return Event.find({
          _id: { $nin: events },
          startDate: { $gt:  getNextHourDate()},
          isClosed: false,
          isClosedToPublic: { $ne: true },
        }).sort("startDate").exec();
      })
  }
};
