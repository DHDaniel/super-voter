
const cookieParser = require("cookie-parser");
const passport_local = require("passport-local");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); // for storing sessions in the database


function setUp(app, db, passport) {

  app.use(cookieParser());

  // setting up sessions. maxAge is the amount of time that the cookie will last
  app.use(session({
    secret : process.env.SESSION_SECRET,
    name : "SessionID",
    saveUninitialized : false,
    resave : false,
    store : new MongoDBStore({
      uri : "mongodb://localhost:27017/local",
      collection : "sessions"
    }),
    cookie : {
      maxAge : 7 * 24 * 60 * 60 * 10 // should last a week
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());


  // configuring passport for authentication by local username and password
  passport.use(new passport_local(
    function (username, password, done) {
      db.collection("users").findOne({ username : username}, function (err, user) {

        if (err) return done(err);

        console.log(user);
        if (user === null) {
          return done(null, false, {message : "User does not exist."});
        }

        console.log(user.password, password);
        if (user.password != password) {
          return done(null, false, {message : "Password is incorrect."});
        }

        return done(null, user);
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
    db.collection("users").findOne({ _id : id }, function (err, user) {
      if (err) done(err);

      return done(null, user);
    });
  });
}

module.exports = setUp;
