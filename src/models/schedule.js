var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ScheduleSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", unique: true },
  // hours: { time1: { task1: [userIds], task2: [..]...}, time2: {...}}
  hours: { type: Schema.Types.Mixed },
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

// Model creation
mongoose.model("Schedule", ScheduleSchema);
