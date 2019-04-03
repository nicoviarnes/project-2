//var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.get("/logout", function(req, res) {
    if (req.session.loggedin) {
      req.session.loggedin = false
      res.redirect("/")
    } else {
      res.send("You are already logged out");
    }
    res.end();
  });

  app.get("/register", function(req, res) {
    res.render("register");
  });

  app.get("/dashboard", function(req, res) {
    if (req.session.loggedin) {
      return res.render("dashboard")
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
