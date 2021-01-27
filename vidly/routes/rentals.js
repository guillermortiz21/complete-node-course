const {Rental, validate} = require('../models/rental');
const {Customer, customerSchema} = require('../models/customer');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

// Make transactions in mongoose!
Fawn.init(mongoose);

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(`Error creating a movie: ${error.details[0].message}`);

  // Get the customer and the movie
  const customer = await findById(Customer, req.body.customerId);
  if(!customer) return res.status(400).send('Invalid customer');

  const movie = await findById(Movie, req.body.movieId);
  if(!movie) return res.status(400).send('Invalid movie');

  if(movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock');

  const rental = new Rental({
    customer:{
      _id: customer._id,
      name: customer.name,
      phone: customer.phone
    },
    movie:{
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  try{
    // We have two actions in the database, we need a 
    // two phase commit (A transaction)
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {
        $inc: {numberInStock: -1}
      })
      .run();
    res.send(rental);
  }catch(err){
    res.status(500).send('Something failed');
  }
});

const findById = async function(model, id){
  try{
    const object = await model.findById(id);
    return object;
  }catch(err){
    console.log(err.message);
    return null;
  }
}

module.exports = router;