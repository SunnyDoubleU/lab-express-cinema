var express = require("express");
var app = express();
// var movies = require("../models/movie")
// var app = express()

/* GET home page */
app.get(`/`, (req, res, next) => {
  console.log(req.session);
  res.render(`index`);
});

// Params
// router.get('/movies/:movieId', (req, res, next) => {
//   movies.findById(req.params.movieId)
//     .then(theMovie => {
//       console.log(theMovie)
//       res.render('movie-details', {movies: theMovie});
//     })
//     .catch(error => {
//       console.log('Error while retrieving movie details:', error);
//     })
// });

//query

module.exports = app;
