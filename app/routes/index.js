
const myPassport = require("./passport-setup.js");
const passport = require("passport");

module.exports = function (app, models) {

  myPassport(app, models, passport);

  app.route("/login")
      .get(function (req, res) {
        res.render("index", { name : (req.user) ? req.user.username : null});
      })
      .post(passport.authenticate("local", { successRedirect : "/login"}));
}
