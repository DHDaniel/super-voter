
const passport = require("passport");

const myPassport = require("./passport-setup.js");
const signup = require("../controllers/signup.server.js");
const logout = require("../controllers/logout.server.js");
const getpolls = require("../controllers/userpolls.server.js");
const createpoll = require("../controllers/createpoll.server.js");

module.exports = function (app, models) {

  // configuring passport
  myPassport(app, models, passport);

  /*
  Home page - this is the default homepage for voter.
  */

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


  /*
  login
  GET - displays login/signup form to user.
  POST - sends data to server about logging in. If credentials are correct, user is authenticated.
  */
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

  /*
  signup
  POST - sends data to create a new user to server
  */
  app.route("/signup")

      .post(function (req, res) {

        var newUser = {
          username : req.body.username,
          password : req.body.password
        }

        signup(models, newUser, function (err, user, info) {
          if (err) console.log(err);

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

  /*
  logout
  POST - logs out the user, redirects to home page
  */
  app.route("/logout")

      .post(logout);

  /* dashboard
  GET - sends the user (if authenticated) to their dashboard.
  */
  app.route("/dashboard")

      .get(function (req, res) {
        if (req.user) {
          res.render("dashboard", {
            title : "My Dashboard",
            styles : [
              "/stylesheets/dashboard.css"
            ],
            scripts : [
              "https://cdnjs.cloudflare.com/ajax/libs/reqwest/2.0.5/reqwest.min.js",
              "/scripts/dist/app.js"
            ],
            user : req.user
          });
        } else {
          res.redirect("/");
        }
      });




  /*
  ============================
  API ROUTES
  ============================
  */

  /*
  Return all of the current polls of signed in users
  */
  app.route("/api/user/polls")

      .get(function (req, res) {
        // if authenticated
        if (req.user) {
          getpolls(models, req.user.username, function(err, polls) {
            if (err) throw err;
            res.json(polls);
            res.end();
          });
        } else {
          // send error
          res.status(401).end("401 Unauthorized.");
        }
      });

  app.route("/api/user/createpoll")

      .post(function (req, res) {
        createpoll(models, req.user, req.body, function (err, success) {
          if (err) throw err;

          if (success) {
            res.redirect("/dashboard");
          }
        });
      })
}
