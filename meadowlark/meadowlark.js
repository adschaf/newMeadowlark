var fortune = require("./lib/fortune.js");
var express = require("express");
var app = express();

var handlebars = require('express-handlebars').create({
  defaultLayout:'main',
  helpers: {
    section: function(name, options){
      if(!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
});

var handlebars = require("express-handlebars").create({ defaultLayout: "main" });
app.engine("handlebars", handlebars.engine);
app.set("view engine", "handlebars");

app.set("port", process.env.PORT || 3000);
app.use(express.static(__dirname + "/public"));

// set 'showTests' context property if the querystring contains test=1
app.use(function(req, res, next){
  res.locals.showTests = app.get("env") !== "production" && req.query.test === "1";
  next();
});

app.get("/", function(req, res) {
  res.render("home", {
    currency: {
      name: "United States dollars",
      abbrev: "USD",
    },
    tours: [
      {
        name: "Hood River",
        price: "$99.95" 
      },
      {
        name: "Oregon Coast",
        price: "$159.99"
      }
    ],
    specialsURL: "/january-specials",
    currencies: ["USD", "GBP", "BTC"]
  });
});

app.get("/about", function(req, res) {
  res.render("about", { fortune: fortune.getFortune(),
             pageTestScript: "/qa/tests-about.js" });
});

app.get("/datetime", function(req, res) {
  res.render("datetime", { datetime: new Date().toString() });
});

app.get("/tours/hood-river", function(req, res) {
  res.render("tours/hood-river");
});

app.get("/tours/request-group-rate", function(req, res) {
  res.render("tours/request-group-rate");
});

app.get("/tours/oregon-coast", function(req, res) {
  res.render("tours/oregon-coast");
});

// custom 404 page
app.use(function(req, res) {
  res.status(404);
  res.render("404");
});

// custom 500 page
app.use(function(err, req, res, next) {
  console.log(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), function() {
  console.log("Express started on http://localhost:" + app.get("port") + "; Press Ctrl-C to terminate.");
});
