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
        console.log(data.dataValues);
        var user = data.dataValues;
        if (user.username === username && user.password === password) {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/dashboard");
        } else {
          res.send("Incorrect Username and/or Password!");
        }
        res.end();
      });
    } else {
      res.send("Please enter Username and Password!");
      res.end();
    }
  });

  app.post("/register", function(req, res) {
    const {
      username,
      password,
      firstName,
      lastName,
      email,
      instruments,
      genres,
      bio
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
          instruments,
          genres,
          bio
        }).then(result => {
          req.session.loggedin = true;
          req.session.username = username;
          res.redirect("/dashboard");
        });
      } else {
        res.send("That username is taken! Please choose another username.");
      }
    });
  });
};
