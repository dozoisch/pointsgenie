var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventSchema = new Schema({
  date: { type: Date, required: true },
  name: { type: String },
});
// Add a toString method or w/e

// Model creation
mongoose.model('Event', EventSchema);
