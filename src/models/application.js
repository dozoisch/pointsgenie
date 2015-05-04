var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ApplicationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User"},
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  preferredTask: { type: String, trim: true },
  // TODO: validate that its between start/end time
  availabilities: [{ type: Date, required: true }],
},{
  toObject: { virtuals: true },
  toJSON : {
    transform: function (doc, ret, options) {
      ret.id = doc.id;
      ret._id = undefined;
      ret.__v = undefined;
      return ret;
    }
  }
});

ApplicationSchema.index({ user: 1, event: 1 }, { unique: true });

// Model creation
mongoose.model("Application", ApplicationSchema);
