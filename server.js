
const express = require("express");
const mongo = require("mongodb").MongoClient;
const consolidate = require("consolidate");
const helmet = require("helmet");
const bodyParser = require("body-parser");

const routes = require("./app/routes/index.js");

var app = express();


var dburl = "mongodb://localhost:27017/local";


mongo.connect(dburl, function (error, db) {

  if (error) {
    throw new Error("Database failed to connect at " + dburl + ". Please verify that the database is running and is working correctly.");
  } else {
    console.log("Connection to database at " + dburl + " successful.");
  }

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
  routes(app, db);

  // starting the app
  app.listen(app.get("port"), function () {
    console.log("Node starting on port", app.get("port"));
  })

})
