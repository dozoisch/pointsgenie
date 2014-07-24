var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User"},
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  tasksPrefs: {
    "first": { type: String, required: true, trim: true },
    "second": { type: String, required: true, trim: true },
    "third": { type: String, required: true, trim: true },
  },
  // TODO: validate that its between start/end time
  disponibility: [{ type: Date, required: true }],
});

// Model creation
mongoose.model("Application", ApplicationSchema);
