const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const moment = require('moment');

const mongoose = require('mongoose');
const Joi = require('joi');

router.post('/', auth, async(req, res) => {
  if(!req.body.customerId) 
    return res.status(400).send('customerId was provided');
  if(!req.body.movieId) 
    return res.status(400).send('movieId was provided');
  
  if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
    return res.status(404).send('Invalid customer Id');
  if(!mongoose.Types.ObjectId.isValid(req.body.movieId))
    return res.status(404).send('Invalid movie Id');

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId,
    'movie._id': req.body.movieId
  });

  if(!rental) return res.status(404).send('Rental not found');
  if(rental.dateReturned) return res.status(400).send('Return was already processed.');
  
  // set the dateReturned date
  rental.dateReturned = new Date();
  // set the rental fee
  const rentalDays = moment().diff(rental.dateOut, 'days')
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
  await rental.save();

  // Increase the movie stock
  const movie = await Movie.findOne({_id: req.body.movieId});
  movie.numberInStock = movie.numberInStock + 1;
  await movie.save();

  res.send(rental);
});

module.exports = router;