import { model } from "mongoose";
const Application = model("Application");
const Event = model("Event");

export default {
  fetchUserApplications(user) {
    return Application
      .find({ user }).exec()
      .then(applications => {
        const eventIds = applications.map(application => application.event);
        return Event.find({ _id: { $in: eventIds } }).exec()
          .then(events => {
            return {
              applications,
              events,
            };
          });
      });
  }
};
