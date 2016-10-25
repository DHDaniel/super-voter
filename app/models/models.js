
const mongoose = require("mongoose");
const poll = require("./poll.js");
const user = require("./user.js");


function Models() {
  this.User = mongoose.model("User", user);
  this.Poll = mongoose.model("Poll", poll);
}


module.exports = new Models();
