/**
 * Dependencies
 */
var bcrypt = require('../../lib/bcrypt_thunk'); // version that supports yields
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var co = require('co');

/**
 * Constants
 */
const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  cip: { type: String, required: true, unique: true, lowercase: true, match: /^[a-z]{4}\d{4}$/ },
  password: { type: String },
  points: { type: Number, required: true, default: 0 }
}, {
  toJSON : {
    transform: function (doc, ret, options) {
      delete ret.password;
    }
  }
});

/**
 * Middlewares
 */
UserSchema.pre('save', co(function *(next) {
  // only hash the password if it has been modified (or is new)
  if (!this.password || this.password.length < 1 || !this.isModified('password')) {
    return next();
  }
  try {
    var salt = yield bcrypt.genSalt();
    var hash = yield bcrypt.hash(this.password, salt);
    this.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
}));

/**
 * Methods
 */
UserSchema.methods.comparePassword = function *(candidatePassword) {
  // User password is not set yet
  if(!this.password || this.password.length < 1) return false;
  return yield bcrypt.compare(candidatePassword, this.password);
};

/**
 * Statics
 */

UserSchema.statics.passwordMatches = function *(cip, password) {
  var user = yield this.findOne({ 'cip': cip.toLowerCase() }).exec();
  if(!user) throw new Error('User not found');

  if(yield user.comparePassword(password))
    return user;

  throw new Error('Password does not match');
};

UserSchema.statics.findOrCreateCAS = function *(profile, casRes) {
  var user = yield this.findOne({ 'cip': profile.id }).exec();

  if (user) return user;

  user = new this({cip: profile.id });
  yield user.save();
  return user;
};

// Model creation
mongoose.model('User', UserSchema);
