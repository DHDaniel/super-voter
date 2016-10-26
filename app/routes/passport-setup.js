
const cookieParser = require("cookie-parser");
const passport_local = require("passport-local");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // for storing sessions in the database
const password = require("password-hash-and-salt");


function setUp(app, models, passport) {

  app.use(cookieParser());

  // setting up sessions. maxAge is the amount of time that the cookie will last
  app.use(session({
    secret : process.env.PASSPORT_SESSION_SECRET,
    name : "SessionID",
    saveUninitialized : false,
    resave : false,
    store : new MongoDBStore({
      uri : "mongodb://localhost:27017/local",
      collection : "sessions"
    }),
    cookie : {
      maxAge : 60 * 1000 // should last a minute
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());


  // configuring passport for authentication by local username and password
  passport.use(new passport_local(
    function (username, passw, done) {
      models.User.where({ username : username}).findOne().exec(function (err, user) {

        if (err) return done(err);

        if (!user) {
          return done(null, false, {message : "User does not exist."});
        }

        // verifying hash
        password(passw).verifyAgainst(user.password, function (err, verified) {

          if (err) return done(err);

          if (verified) {
            return done(null, user);
          }

          if (verified === false) {
            return done(null, false, {message : "Password is incorrect."});
          }

        });
      });
    }
  ));

  // serializing functions required for sessions to persist between pages.
  passport.serializeUser(function (user, done) {
    // here, the object ID is given to the cookie
    return done(null, user._id);
  });

  passport.deserializeUser(function (id, done) {
    // here, the object ID is used to find the relevant information about the user, by calling the database
    models.User.findById(id).exec(function (err, user) {
      if (err) done(err);

      return done(null, user);
    });
  });
}

module.exports = setUp;
