var db = require("../models");

module.exports = function(app) {
  app.post("/auth", function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    if (username && password) {
      db.User.findOne({
        where: {
          username: username,
          password: password
        }
      }).then(function(data) {
        var user;
        if(data !== null) {
          user = data.dataValues;
        }

        if(data === null){
          return res.send("No user found")
        }

        if (user.username === username && user.password === password) {
          req.session.loggedin = true;
          req.session.username = username;
          return res.redirect("/dashboard");
        } else {
          return res.send("Incorrect Username and/or Password!");
        }
        res.end();
      });
    } else {
      return res.send("Please enter Username and Password!");
      res.end();
    }
  });

  app.get("/map/api", function(req, res) {
    res.send("hello map.js!")
  });

  app.post("/register", function(req, res) {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      instruments,
      genres,
      bio,
   // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      longitude,
      latitude
    // / ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    } = req.body;

    db.User.findOne({
      where: {
        username
      }
    }).then(function(data) {
      console.log(data);
      var user;
      if(data !== null) {
        user = data.dataValues;
      }
      
      if (data === null || user.username === null) {
        db.User.create({
          username,
          password,
          firstName,
          lastName,
          email,
          address,
          city,
          state,
          instruments,
          genres,
          bio,
          // ~~~~~~~~~~~~~~~~~~~~~~
          longitude,
          latitude
          // ~~~~~~~~~~~~~~~~~~~~~~
        }).then(result => {
          req.session.loggedin = true;
          req.session.username = username;
          return res.redirect("/dashboard");
        });
      } else {
        return res.send("That username is taken! Please choose another username.");
      }
    });
  });
};
