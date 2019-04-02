//var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.get("/register", function(req, res) {
    res.render("register");
  });

  app.get("/dashboard", function(req, res) {
    if (req.session.loggedin) {
      res.send("Welcome back, " + req.session.username + "!");
    } else {
      res.send("Please login to view this page!");
    }
    res.end();
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
