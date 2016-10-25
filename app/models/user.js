
const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  username : String,
  password : String,
  polls : [mongoose.Schema.Types.ObjectId]
});

module.exports = userSchema;
