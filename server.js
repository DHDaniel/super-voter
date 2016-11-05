
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const hbs = require("express-handlebars");

const routes = require("./app/routes/index.js");
const models = require("./app/models/models.js");

var app = express();


var dburl = "mongodb://localhost:27017/local";

// connecting to the database via Mongoose.
mongoose.connect(dburl);
var db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));

// once the database connection has been established, we can begin to do stuff with the app
db.once("open", function () {

  console.log("Successfully connected to mongoDB using Mongoose at", dburl);

  // logging to console
  app.use(function (req, res, next) {
    console.log(req.method, req.originalUrl);
    next()
  });

  // for serving static files like CSS and images
  app.use(express.static( process.cwd() + "/static/"));
  // JS
  app.use(express.static( process.cwd() + "/app/controllers/"));

  /* for rendering views using handlebars. This configuration allows for layouts
  and partials to be used - allowing for template inheritance. Quite useful. QUITE useful.

  This configuration assumes that templates live in views/ , layouts live in views/layouts
  and partials live in views/partials.
  */
  app.engine("handlebars", hbs({defaultLayout : "base"}));
  app.set("view engine", "handlebars");

  // form handling
  app.use(bodyParser.urlencoded({ extended: false }))

  // security
  app.use(helmet());

  // port
  app.set("port", process.env.PORT || 8080);

  // application routing
  routes(app, models);

  // starting the app
  app.listen(app.get("port"), function () {
    console.log("Node starting on port", app.get("port"));
  })

});
