
const mongoose = require("mongoose");

var pollSchema = mongoose.Schema({
  title : String,
  options : [{
    name : String,
    votes : Number
  }],
  shortid : String,
  date_created : Date
});

module.exports = pollSchema;
