import Model from "./Model";

class Event extends Model {
  static schema = {
    id: { type: String },
    name: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    tasks: [{ type: String }],
    isClosed: { type: Boolean },
    isPointsAttributed: { type: Boolean },
  };
}

export default Event;
