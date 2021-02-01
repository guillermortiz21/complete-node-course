const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

const movieSchema = new mongoose.Schema({
  title: {type: String, minlength: 3, maxlength: 255, required: true, trim: true},
  genre: {type: genreSchema, required: true},
  numberInStock:{type: Number, min: 0, max:255, required: true, default: 0},
  dailyRentalRate:{type: Number, min:0, max:255, required: true, default: 0}
})

const Movie = mongoose.model('Movie', movieSchema);

const validate = function(movie){
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
  });
  return schema.validate(movie);
}

const addOneToStock = async function(movieId){
  const movie = await Movie.findOne({_id: movieId});
  movie.numberInStock = movie.numberInStock + 1;
  await movie.save();
}

module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.validate = validate;
module.exports.addMovieToStock = addOneToStock;
