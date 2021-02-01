const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const moment = require('moment');
const validate = require('../middleware/validate')
const Joi = require('joi');


router.post('/', [auth, validate(returnsValidator)], async(req, res) => {
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

function returnsValidator(returnObject){
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate(returnObject);
}

module.exports = router;