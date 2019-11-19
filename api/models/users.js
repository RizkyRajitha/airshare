const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// const bcrypt = require("bcryptjs");

saltRounds = 10;

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    dropDups: true
  },
  firstName: {
    type: String
  },
  emailverified: {
    type: Boolean,
    default: false
  },
  lastName: {
    type: String
  },
  userName: {
    type: String
  },
  userType: {
    type: String
  },
  hash: {
    type: String
  },
  tempotp: {
    type: String
  },
  storageSpace: {
    type: Number,
    default: 0
  },
  phone: {
    type: String
  },
  resources: [
    {
      id: { type: String },
      contenthash: { type: String },
      name: { type: String }, //file name
      path: { type: String }, // file path
      type: { type: String }, //file or a folder
      created: { type: String }, //timestamp
      size: { type: String }, //file size N/A folder
      allowaccess: { type: Boolean, default: false } //allow to access over third party
    }
  ]
});

// userSchema.methods.verifypass = function(password) {
//   console.log("very pass - " + this.email + "\n hash - " + this.hash);
//   const sts = bcrypt.compareSync(password, this.hash);
//   console.log(" pass verified - " + sts);
//   return sts;
// };
// });

// console.log("this name - " + this.email);
// console.log("salt - " + this.salt);
// console.log("pass - " + password);
// userr = this;
// const hash = crypto
//   .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
//   .toString("hex");
// return hash === this.hash;

userSchema.statics.getUserByToken = function(token) {
  console.log("inside get token");

  try {
    var data = jwt.verify(token, "authdemo");
    console.log("decode data " + data.id);
    var User = this;

    return User.findOne({ _id: data.id });
  } catch (error) {
    return new Promise((resolve, reject) => {
      reject(error);
    });
  }
};

userSchema.methods.generateregularJWT = function() {
  console.log("inside genJWT");

  // console.log(this.email)

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      type: "regular"
    },
    "authdemo",
    { expiresIn: "3600m" }
  );
};

userSchema.methods.generatetempJWT = function() {
  console.log("inside genJWT");

  // console.log(this.email)

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
      type: "temp"
    },
    "authdemo",
    { expiresIn: "360m" }
  );
};

const User = mongoose.model("User", userSchema);

module.exports = User;
