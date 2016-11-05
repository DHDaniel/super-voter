
/* Controller that gets the initial context for the dashboard, taking care
of populating the polls section of the User object, and passing the appropriate
context to the template.
@param user -> user from req.user, currently logged in
@param models -> object with all models which is already connected
@param callback -> callback that will be called on success.
*/

module.exports = function (user, models, callback) {

  models.User
  .findOne({username : user.username})
  .populate("polls")
  .exec(function (err, user) {
    if (err) {
      return callback(err);
    }

    var context = {
      title : "My Dashboard",
      styles : [
        "/stylesheets/dashboard.css"
      ],
      scripts : [
        "/scripts/dashboard.js"
      ],
      user : user
    };

    return callback(null, context);
  });
}
