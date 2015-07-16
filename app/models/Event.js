import Model from "./Model";

class Event extends Model {
  static schema = {
    id: { type: String },
    name: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    obligatoryHours: { type: Number },
    tasks: [{ type: String }],
    isClosed: { type: Boolean },
    isClosedToPublic: { type: Boolean },
    isPointsAttributed: { type: Boolean },
  };
}

export default Event;
