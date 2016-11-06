
/* Function takes in models, user object, and a form object with all the fields, and creates
a new poll under the signed in user. It then returns either a success or a failure
*/

const shortid = require("shortid");

module.exports = function (models, user, form, callback) {

  var pollOptions = form.options.map(function (option) {
    return {
      name : option,
      votes : 0
    }
  });

  var today = new Date();

  // creating a new poll
  var newPoll = new models.Poll({
    title : form.title,
    options : pollOptions,
    shortid : shortid.generate(),
    date_created : today
  });

  newPoll.save(function (err) {
    if (err) return callback(err);

    var pollid = newPoll._id;

    models.User.update({ username : user.username }, {
      $push : { polls : pollid}
    }, function (err, data) {
      if (err) return callback(err);

      return callback(null, true);

    });
  });
}
