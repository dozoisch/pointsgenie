import Model from "./model";

class User extends Model {
}

User.schema = {
  id: { type: String },
  cip: { type: String },
  name: { type: String },
  email: { type: String },
  isAdmin: { type: Boolean },
  created: { type: Date },
  points: [ {
    type: Object,
    shape: {
      _id: { type: String },
      reason: { type: String },
      points: { type: Number },
    },
  } ],
  totalPoints: { type: Number },
  promocard: { type: Object, shape: {
      price: { type: Number },
      date: { type: Date },
    },
  },
};

export default User;
