const mongoose = require('mongoose');
const Joi = require('joi');
const {genreSchema} = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {type: String, minlength: 3, maxLength: 255, required: true, trim: true},
  genre: {type: genreSchema, required: true},
  numberInStock:{type: Number, min: 0, max:255, required: true, default: 0},
  dailyRentalRate:{type: Number, min:0, max:255, required: true, default: 0}
}));

const validate = function(movie){
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required()
  });
  return schema.validate(movie);
}

module.exports.Movie = Movie;
module.exports.validate = validate;
