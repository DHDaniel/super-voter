
const mongoose = require("mongoose");

var pollSchema = mongoose.Schema({
  title : String,
  options : [{
    name : String,
    votes : Number
  }],
  shortid : String
});

module.exports = pollSchema;
