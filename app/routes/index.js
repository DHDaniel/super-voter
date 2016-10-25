
const passport = require("passport");

const myPassport = require("./passport-setup.js");
const signup = require("../controllers/signup.server.js");

module.exports = function (app, models) {

  // configuring passport
  myPassport(app, models, passport);  

  app.route("/login")

      .get(function (req, res) {
        res.render("login", { name : (req.user) ? req.user.username : null});
      })

      .post(function (req, res, next) {
        // sadly authentication has to be done this way. I was not able to pass req, res and next
        // to the function if I was importing it from somewhere else, due to closure issues.
        passport.authenticate("local", function (err, user, info) {

          if (err) return next(err);

          if (user === false) {
            var errInfo = info.message;
            return res.render("login", {error : errInfo});
          }

          // manually logging in user
          req.login(user, function (err) {
            if (err) return next(err);
            return res.redirect("/login");
          });

        })(req, res, next);
      });

  app.route("/signup")

      .get(function (req, res) {
        res.render("signup", {});
      })

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
              return res.redirect("/login");
            })
          } else {
            res.render("signup", {error : info.message});
          }

        });

      });
}
