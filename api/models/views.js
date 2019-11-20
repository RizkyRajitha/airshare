const mongoose = require("mongoose");

var Schema = mongoose.Schema;

var viewsSchema = new Schema({
  route: { type: String },
  location: {
    type: String
  },
  time: {
    type: String
  },
  ip: { type: String }
});

const Views = mongoose.model("Views", viewsSchema);

module.exports = Views;
