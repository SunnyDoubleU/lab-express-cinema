//BCrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const express = require("express");
const app = express();

// User model
const User = require("../models/user");

app.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

app.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "please input username and password to sign up"
    });
    return;
  }

  User.findOne({ username: username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "username already taken!"
        });
        return;
      }
      return User.create({
        username: username,
        password: hashPass
      });
    })
    .then(user => {
      req.session.user = user;
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
    });
});

app.get("/login", (req, res, next) => {
  res.render("auth/login");
});

app.post("/login", (req, res, next) => {
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "please enter both fields!"
    });
    return;
  }

  User.findOne({ username: theUsername })
    .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "you are not in our database!!!!"
        });
        return;
      }
      if (bcrypt.compare(thePassword, user.password)) {
        req.session.currentUser = user;
        res.redirect("/movies");
      } else {
        res.render("auth/login", {
          errorMessage: "did you forget your password again....."
        });
      }
    })
    .catch(err => {
      next(err);
    });
});

app.get("/logout", (req, res, next) => {
  req.session.destroy(err => {
    res.redirect("/login");
  });
});

module.exports = app;
