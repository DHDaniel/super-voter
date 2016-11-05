
const passport = require("passport");

const myPassport = require("./passport-setup.js");
const signup = require("../controllers/signup.server.js");
const logout = require("../controllers/logout.server.js");

module.exports = function (app, models) {

  // configuring passport
  myPassport(app, models, passport);

  app.route("/")

      .get(function (req, res) {
        res.render("index", {
          title : "Voter - what's YOUR opinion?",
          styles : [
            "/stylesheets/index.css"
          ],
          user : req.user
        });
      });

  app.route("/login")

      .get(function (req, res) {
        res.render("login", {layout : false});
      })

      .post(function (req, res, next) {
        // sadly authentication has to be done this way. I was not able to pass req, res and next
        // to the function if I was importing it from somewhere else, due to closure issues.
        passport.authenticate("local", function (err, user, info) {

          if (err) return next(err);

          // displaying error messages
          if (user === false) {
            var errInfo = info.message;
            return res.render("login", {error : errInfo, layout : false});
          }

          // manually logging in user
          req.login(user, function (err) {
            if (err) return next(err);
            return res.redirect("/");
          });

        })(req, res, next);
      });

  app.route("/signup")

      .post(function (req, res) {

        var newUser = {
          username : req.body.username,
          password : req.body.password
        }

        signup(models, newUser, function (err, user, info) {
          if (err) throw err;

          if (user) {
            req.login(user, function (err) {
              if (err) throw err;
              return res.redirect("/");
            });
          } else {
            res.render("login", {error : info.message, layout : false});
          }

        });

      });


  app.route("/logout")

      .post(logout);

  app.route("/dashboard")

      .get(function (req, res) {
        res.render("dashboard", {
          title : "My Dashboard",
          styles : [
            "/stylesheets/dashboard.css"
          ],
          scripts : [
            "/scripts/dist/app.js"
          ],
          user : req.user
        })
      });
}
