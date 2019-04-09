var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    return res.render("index");
  });

  // Login route
  app.get("/login", function(req, res) {
    if (req.session.loggedin) {
      return res.render("oops2");
    }
    return res.render("login");
  });

  // Logout route
  app.get("/logout", function(req, res) {
    if (req.session.loggedin) {
      req.session.loggedin = false;
      return res.redirect("/");
    } else {
      return res.render("oops3");
    }
  });

  // Registration route
  app.get("/register", function(req, res) {
    if (req.session.loggedin) {
      return res.render("oops2");
    } else {
      return res.render("register");
    }
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
          return res.render("oops4");
        }
      });
      // if the user isn't logged in, throw an error message
    } else {
      return res.render("oops");
    }
  });

  // map  route
  app.get("/map", function(req, res) {
    if (req.session.loggedin) {
      return res.render("map");
    } else {
      return res.render("oops");
    }
  });

  // search  route
  app.get("/search", function(req, res) {
    if (req.session.loggedin) {
      return res.render("search");
    } else {
      return res.render("oops");
    }
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    return res.render("404");
  });
};
