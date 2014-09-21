var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User"},
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  preferredTask: { type: String, trime: true },
  // TODO: validate that its between start/end time
  availabilities: [{ type: Date, required: true }],
});

ApplicationSchema.index({ user: 1, event: 1 }, { unique: true });

// Model creation
mongoose.model("Application", ApplicationSchema);
