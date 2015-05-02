/**
 * Dependencies
 */
var bcrypt = require("../../lib/bcrypt-thunk"); // version that supports yields
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var co = require("co");

var Ldap = require("../../lib/ldap.js");
// @TODO do me better
var LdapInstance = new Ldap();

/**
 * Constants
 */
const SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  data: {
    cip: { type: String, required: true, unique: true, lowercase: true, match: /^[a-z]{4}\d{4}$/ },
    email: { type: String, lowercase: true },
    name: { type: String },
    concentration: { type: Number },
    promocard: {
      price: { type: Number },
      date: { type: Date },
    },
    totalPoints: { type: Number },
    points: [{
      reason: { type: String, required: true },
      points: { type: Number },
    }],
  },
  meta: {
    password: { type: String },
    provider: {type : String },
    isAdmin: { type: Boolean, default: false }
  }
}, {
  toObject: { virtuals: true },
  toJSON : {
    transform: function (doc, ret, options) {
      // Only act on the parent document
      if ("function" !== typeof doc.ownerDocument) {
        let retVal = ret.data;
        retVal.id = doc.id;
        retVal.created = doc.meta.created;
        retVal.isAdmin = doc.meta ? doc.meta.isAdmin : undefined;
        retVal.hasPassword = doc.hasPassword();
        return retVal;
      }
      ret.id = doc._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

/**
 * Virtuals
 */
UserSchema.virtual('meta.created').get(function () {
  return this._id.getTimestamp();
});
UserSchema.virtual("password").set(function (password) {
  this.meta.password = password;
});
UserSchema.virtual("password").get(function () {
  return this.meta.password;
});

/**
 * Middlewares
 */
UserSchema.pre("save", function (done) {

  // If a modifications has been done on points log, recalculate the total points
  if (this.isModified("data.points")) {
    var totalPoints = 0;
    for (var i = 0; i < this.data.points.length; ++i) {
      totalPoints += this.data.points[i].points;
    }
    this.data.totalPoints = totalPoints;
  }

  // Only hash the password if it has been modified (or is new)
  if (!this.meta.password || this.meta.password.length < 1 || !this.isModified("meta.password")) {
    return done();
  }

  bcrypt.genSalt(SALT_WORK_FACTOR)
  .then(function (salt) {
    return bcrypt.hash(this.meta.password, salt)
  }.bind(this))
  .then(function (hash) {
    this.meta.password = hash;
    done();
  }.bind(this))
  .catch(done);
});

/**
 * Methods
 */

UserSchema.methods.comparePassword = function *(candidatePassword) {
  // User password is not set yet
  if (!this.hasPassword()) { return false; }
  return yield bcrypt.compare(candidatePassword, this.meta.password);
};

UserSchema.methods.hasPassword = function () {
  return (typeof this.meta.password == "string") && (this.meta.password.length > 0);
};

UserSchema.methods.awardPoints = function (giver, points, rawReason) {
  // Get current date
  var date = (new Date().toISOString().split("T"))[0];
  // @TODO export that to a module, so we can test the format
  var reason = date + ": " + giver + " -- " + rawReason;

  this.data.points = this.data.points || [];
  this.data.points.push({
    points: points,
    reason: reason,
  });
};

/**
 * Statics
 */

UserSchema.statics.findByCip = function (cip) {
  return this.findOne({ "data.cip": cip.toLowerCase() });
};

UserSchema.statics.findAndComparePassword = function *(cip, password) {
  var user = yield this.findByCip(cip).exec();

  if (!user) { throw new Error("User not found"); }

  if (yield user.comparePassword(password)) {
    user.meta.provider = "local";
    yield user.save();
    return user;
  }
  console.log("findAndComparePassword", "not match")
  throw new Error("Password does not match");
};

UserSchema.statics.fetchInfoFromLDAP = function *(cip, user) {
  var ldapAnswer = yield LdapInstance.searchByCipThunk(cip);
  fillInfosFromLDAP(ldapAnswer[0], user);
};


UserSchema.statics.findOrCreateUser = function *(profile, casRes) {
  var user = yield this.findOne({ "data.cip": profile.id }).exec();

  if (!user) {
    user = new this({ data: { cip: profile.id } });
  }

  fillInfosFromCAS(profile, user);

  if (!user.data.email) {
    // Fetch User infos from LDAP
    yield this.fetchInfoFromLDAP(profile.id, user);
  }

  user.meta.provider = profile.provider;
  yield user.save();

  return user;
};

function fillInfosFromLDAP (profile, user) {
  user.data.email = profile.mail
  user.data.name = profile.cn;
}

function fillInfosFromCAS (profile, user) {
  if (!profile.emails) {
    // We dont have informations
    return;
  }
  user.data.email = profile.emails[0].value;
  user.data.name = profile.displayName;
};

// Model creation
mongoose.model("User", UserSchema);
