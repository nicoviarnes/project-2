var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    return res.render("index");
  });

  app.get("/login", function(req, res) {
    return res.render("login");
  });

  app.get("/map", function(req, res) {
    res.render("map");
  });

  app.get("/logout", function(req, res) {
    if (req.session.loggedin) {
      req.session.loggedin = false;
      return res.redirect("/");
    } else {
      return res.send("You are already logged out");
    }
  });

  app.get("/register", function(req, res) {
    return res.render("register");
  });

  app.get("/dashboard", function(req, res) {
    if (req.session.loggedin) {
      var user;
      db.User.findOne({
        where: {
          username: req.session.username
        }
      }).then(function(data) {
        if (data !== null) {
          user = data.dataValues;
          console.log(user);
          return res.render("dashboard", user);
        }
      });
    } else {
      return res.send("Please login to view this page!");
    }
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    return res.render("404");
  });
};
