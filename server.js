
const express = require("express");
const consolidate = require("consolidate");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const routes = require("./app/routes/index.js");
const models = require("./app/models/models.js");

var app = express();


var dburl = "mongodb://localhost:27017/local";

mongoose.connect(dburl);

var db = mongoose.connection;

db.on("error", console.error.bind(console, 'connection error:'));

db.once("open", function () {

  console.log("Successfully connected to mongoDB using mongoose at", dburl);

  // logging to console
  app.use(function (req, res, next) {
    console.log(req.method, req.originalUrl);
    next()
  });

  // for serving static files like CSS and images
  app.use(express.static( process.cwd() + "static/"));

  // for rendering views using handlebars
  app.engine("html", consolidate.handlebars);
  app.set("view engine", "html");
  app.set("views", process.cwd() + "/views");

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
