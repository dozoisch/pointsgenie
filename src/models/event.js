var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  name: { type: String, required: "{PATH} est requis", trim: true },
  startDate: { type: Date, required: "{PATH} est requis}" },
  endDate: { type: Date, required: "{PATH} est requis}" },
  tasks: [{ type: String, trim: true}],
  obligatoryHours: { type: Number, default: 0 },
  isClosed: { type: Boolean, default: false },
  isClosedToPublic: { type: Boolean, default: false },
  isPointsAttributed: { type: Boolean, default: false },
}, {
  toObject: { virtuals: true },
  toJSON : {
    transform: function (doc, ret, options) {
      ret.id = doc.id;
      ret._id = undefined;
      return ret;
    }
  }
});
// Add a toString method or w/e

// Model creation
mongoose.model("Event", EventSchema);
