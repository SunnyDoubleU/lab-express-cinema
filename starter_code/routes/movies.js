var express = require("express")
var app = express()
var movies = require("../models/movie")
var script = require("../public/javascripts/script")

app.get('/movies', (req, res) => {
    movies.find({})
    .then( movies => {
        res.render("movies",{movies})
    })
    .catch( err => {
        res.send(err)
    })
})

app.get("/movies/create", (req, res)=> {
    res.render("movies-create")
})

app.post("/movies/create", (req, res)=> {
     debugger
     var newMovie = new movies({
         title: req.body.title,
         director: req.body.director,
         description: req.body.description,
         image: req.body.image,
        //  stars: [req.body.star1, req.body.star2, req.body.star3, req.body.star4],
         stars: script.starsArray,
         showtimes: [req.body.show1, req.body.show2, req.body.show3, req.body.show4, req.body.show5]
     })

     newMovie.save()
        .then((movie) => {
            console.log(movie)
            console.log("meow")
            res.redirect(`/movies/movie?movieId=${movie.id}`)
        })
        .catch((err) => {
            res.send(err)
        })
    //   to do: get post Data
    //   to do: create new beer using beer module
    //   to do: redirect user 
})

app.get("/movies/movie", (req, res, next)=> {
    movies.findById(req.query.movieId)
    .then((movie)=> {
        res.render("movie-details", {movies: movie})
    })
    .catch((err) => {
        res.send(err)
    })
  })

app.get("/movies/delete", (req, res, next)=> {
    movies.findByIdAndDelete(req.query.movieId)
    .then((movie)=> {
        res.redirect("/movies")
    })
    .catch((err) => {
        res.send(err)
    })
})

module.exports = app

