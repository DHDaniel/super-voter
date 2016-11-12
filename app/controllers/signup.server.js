
const password = require("password-hash-and-salt");


/*==========================

CONTROLLER FOR SIGNING UP

It expects to be passed the models object (giving it access to the database), a
newUser object containing the username and password, and a callback, which will be called
once it is finished. The callback will be passed the error as first argument, the user as the second argument (which will be false if it failed), and an info object containing more information, a la
passport.js

==============================*/


module.exports = function (models, newUser, callback) {

  var name = newUser.username;
  var passw = newUser.password;

  models.User.findOne({ username : name }, function (err, user) {

    // if user DOES NOT already exist
    if (!user && name !== "" && passw !== "") {

      // hashing password for secure storage.
      var hashPass = password(passw).hash(function (err, hash) {

        if (err) return callback(err);

        var user = models.User({
          username : name,
          password : hash,
          polls : []
        });


        user.save( function (err) {
          if (err) return callback(err);

          callback(null, user);

        });
      });

    } else {

      if (name == "") {
        return callback(null, false, {message : "Please enter a username"});
      }

      if (passw == "") {
        return callback(null, false, {message : "Please enter a password"})
      }

      // if username is taken
      return callback(null, false, {message : "Username is taken"});
    }
  });
}
