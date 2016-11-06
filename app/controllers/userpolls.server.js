
/*
Function takes in models, the username to look for, and a callback function.
The callback is called with the JSON data that was returned, containing all of
the signed in user's polls
*/

module.exports = function (models, username, callback) {

  models.User.findOne({ username : username }).populate("polls").exec(function (err, user) {

    if (err) return callback(err);

    return callback(null, JSON.stringify(user.polls));
  })
}
