import bcrypt from "bcrypt";

// These do not need to be promisified
module.exports = bcrypt.genSaltSync;
module.exports = bcrypt.hashSync;
module.exports = bcrypt.compareSync;
module.exports.getRounds = bcrypt.getRounds;

module.exports.genSalt = (rounds, ignore) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(rounds, ignore, (err, salt) => {
      if(err) return reject(err);
      return resolve(salt);
    });
  });
};

module.exports.hash = (data, salt) => {
  return new Promise(function (resolve, reject) {
    bcrypt.hash(data, salt, function (err, hash) {
      if(err) return reject(err);
      return resolve(hash);
    });
  });
};

module.exports.compare = (data, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(data, hash, (err, matched) => {
      if(err) return reject(err);
      return resolve(matched);
    });
  });
};
