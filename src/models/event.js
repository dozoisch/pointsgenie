var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  name: { type: String, required: true, trim: true },
  roles: [{ type: String, trim: true}]
});
// Add a toString method or w/e

// Model creation
mongoose.model("Event", EventSchema);
