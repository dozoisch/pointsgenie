import Model from "./Model";
import User from "./User";
import Event from "./Event";

class Application extends Model {
  static schema = {
    id: { type: String },
    user: { type: String },
    event: { type: String },
    preferredTask: { type: String },
    availabilities: [ { type: Date } ],
  };
}

export default Application;
