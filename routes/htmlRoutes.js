var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    return res.render("index");
  });

  // Login route
  app.get("/login", function(req, res) {
    return res.render("login");
  });

  // Logout route
  app.get("/logout", function(req, res) {
    if (req.session.loggedin) {
      req.session.loggedin = false;
      return res.redirect("/");
    } else {
      return res.send("You are already logged out");
    }
  });

  // Registration route
  app.get("/register", function(req, res) {
    return res.render("register");
  });

  // User dashboard route, checks to see if user is logged in
  app.get("/dashboard", function(req, res) {
    // Check loggedin boolean to see if loggedin = true
    if (req.session.loggedin) {
      var user;
      db.User.findOne({
        where: {
          username: req.session.username
        }
      }).then(function(data) {
        if (data !== null) {
          user = data.dataValues;
          return res.render("dashboard", user);
        } else {
          return res.send("Something went wrong!");
        }
      });
      // if the user isn't logged in, throw an error message
    } else {
      return res.send("Please login to view this page!");
    }
  });

  // map  route
  app.get("/map", function(req, res) {
    return res.render("map");
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    return res.render("404");
  });
};
