const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sharecodeSchema = new Schema({
  code: { type: String },
  key: {
    type: String
  },
  createdAt: {
    type: String
  },
  size: { type: String },
  username: { type: String },
  awsurl: { type: String }
});

const Sharecode = mongoose.model("Sharecode", sharecodeSchema);

module.exports = Sharecode;
