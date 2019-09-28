var mongoose = require("mongoose");

const Movie = mongoose.model("movie", {
  title: String,
  director: {
    type: mongoose.Types.ObjectId,
    ref: "director"
  },
  stars: Array,
  image: String,
  description: String,
  showtimes: Array
});

module.exports = Movie;
