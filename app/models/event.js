import Model from "./model";

class Event extends Model {
}

Event.schema = {
  id: { type: String },
  name: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  tasks: [{ type: String }],
  isClosed: { type: Boolean },
  isPointsAttributed: { type: Boolean },
};

export default Event;
