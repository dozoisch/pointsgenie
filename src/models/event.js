var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  tasks: [{ type: String, trim: true}],
  closed: { type: Boolean, default: false },
});
// Add a toString method or w/e

// Model creation
mongoose.model("Event", EventSchema);
