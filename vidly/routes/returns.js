const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const {Movie, addMovieToStock} = require('../models/movie');
const validate = require('../middleware/validate')
const Joi = require('joi');


router.post('/', [auth, validate(returnsValidator)], async(req, res) => {
  const rental = await Rental.lookup( req.body.customerId, req.body.movieId);

  if(!rental) return res.status(404).send('Rental not found');
  if(rental.dateReturned) return res.status(400).send('Return was already processed.');
  
  rental.return();
  await rental.save();

  // Increase the movie stock
  await addMovieToStock(req.body.movieId);

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