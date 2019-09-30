var express = require("express");
var app = express();
var Movie = require("../models/movie");
var Director = require("../models/director");
var mongoose = require("mongoose");
// var script = require("../public/javascripts/script")

app.get("/movies", (req, res) => {
  if (req.session.currentUser) {
    Movie.find({})
      .populate("director")
      .then(movie => {
        res.render("movies", { movie, user: req.session.currentUser });
      })
      .catch(err => {
        res.send(err);
      });
  } else {
    res.render("auth/login");
  }
});

app.get("/movies/create", (req, res) => {
  Director.find({}).then(director => {
    res.render("movies-create", { director });
  });
});

app.post("/movies/create", (req, res) => {
  let starsArray = req.body.stars.split(",");
  let showsArray = req.body.shows.split(",");

  Movie.create({
    title: req.body.title,
    director: mongoose.Types.ObjectId(req.body.directorId),
    description: req.body.description,
    image: req.body.image,
    stars: starsArray,
    showtimes: showsArray
  })

    .then(movie => {
      res.redirect(`/movies/movie?movieId=${movie.id}`);
    })
    .catch(err => {
      res.send(err);
    });
  //   to do: get post Data
  //   to do: create new beer using beer module
  //   to do: redirect user
});

app.get("/movies/movie", (req, res) => {
  Movie.findById(req.query.movieId)
    .populate("director")
    .then(movie => {
      debugger;
      res.render("movie-details", { movie });
    })
    .catch(err => {
      res.send(err);
    });
});

app.get("/movies/delete", (req, res, next) => {
  Movie.findByIdAndDelete(req.query.movieId)
    .then(movie => {
      res.redirect("/movies");
    })
    .catch(err => {
      res.send(err);
    });
}),
  app.get("/movies/update", (req, res, next) => {
    Movie.findById(req.query.movieId)
      .then(movie => {
        res.render("movies-update", { movie });
      })
      .catch(err => {
        res.send(err);
      });
  });

app.post("/movies/update", (req, res) => {
  Movie.findByIdAndUpdate(req.body.id, {
    title: req.body.title,
    description: req.body.description
  })
    .then(movie => {
      res.redirect(`/movies/movie?movieId=${movie.id}`);
    })
    .catch(err => {
      res.send(err);
    });
});

module.exports = app;
