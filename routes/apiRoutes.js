var db = require("../models");
var axios = require("axios");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

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
        if (data !== null) {
          user = data.dataValues;
        }

        if (data === null) {
          return res.render("oops5");
        }

        if (user.username === username && user.password === password) {
          req.session.loggedin = true;
          req.session.username = username;
          return res.redirect("/dashboard");
        } else {
          return res.render("oops5");
        }
        res.end();
      });
    } else {
      return res.render("oops5");
      res.end();
    }
  });

  app.post("/api/search", function(req, res) {
    db.User.findAll({
      where: {
        instruments: req.body.instrument,
        genres: req.body.genre
      }
    }).then(function(data) {
      return res.send(data);
    });
  });

  app.get("/map/api", function(req, res) {
    db.User.findAll({}).then(function(data) {
      res.send(data);
    });
  });

  app.get("/user/:username", function(req, res) {
    if (req.session.loggedin) {
      var user = req.params.username;
      db.User.findOne({
        where: {
          username: user
        }
      }).then(function(data) {
        if (data !== null) {
          user = data.dataValues;
          return res.render("userprofile", user);
        } else {
          return res.render("oops6");
        }
      });
    } else {
      return res.render("oops");
    }
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
      bio
      // / ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    } = req.body;

    var apiKey = "ed1b14de60384d15bb845d74cb10d41f";

    var url = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${address}%20${city}%20${state}&pretty=1`;

    axios.get(url).then(data => {
      var lng = data.data.results[0].geometry.lat;
      var lat = data.data.results[0].geometry.lng;
      db.User.findOne({
        where: {
          username
        }
      }).then(function(data) {
        var user;
        if (data !== null) {
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
            longitude: lng,
            latitude: lat
            // ~~~~~~~~~~~~~~~~~~~~~~
          }).then(result => {
            req.session.loggedin = true;
            req.session.username = username;

            var transporter = nodemailer.createTransport(
              smtpTransport({
                service: "Gmail",
                host: "smtp.gmail.com",
                port: 465,
                auth: {
                  user: "jamseshxyz@gmail.com",
                  pass: "J@ms3shxyz"
                },
                tls: {
                  rejectUnauthorized: false
                }
              })
            );

            transporter.sendMail(
              {
                from: "jamseshxyz@gmail.com",
                subject: "Welcome to JamSesh!",
                to: email,
                html: `
                  <h1>Welcome to JamSesh.xyz!</h1>
                  <p>Hi ${username}! Thanks for joining us at JamSesh.xyz! We hope you find some radical band mates to jam with!</p>
                  <br>
                  <p>Sincerely,<br>
                    The JamSesh Team</p
                `
              },
              function(error, info) {
                if (error) {
                  return console.log(error);
                } else {
                  console.log("Message sent: " + info.response);
                  return res.redirect("/dashboard");
                }
              }
            );
          });
        } else {
          return res.render("oops7");
        }
      });
    });
  });
};
