const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var invitecodeSchema = new Schema({
  invitecode: {
    type: String
  }
});

const Invitecode = mongoose.model("Invitecode", invitecodeSchema);

module.exports = Invitecode;
