
const mongoose = require("mongoose");

var userSchema = mongoose.Schema({
  username : String,
  password : String,
  polls : [{type : mongoose.Schema.Types.ObjectId, ref : 'Poll'}] // I believe that ref must match the name of the schema it is referencing - in this case, Poll
});

module.exports = userSchema;
