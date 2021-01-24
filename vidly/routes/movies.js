const {Movie, validate} = require('../models/movie');
const express = require('express');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) => {
  const movie = await Movie.find().sort('name');
  res.send(movie);
});

router.get('/:id', async (req, res) => {
  const movie = await lookUpMovie(req.params.id);
  if(!movie) return res.status(404).send(`Movie with id ${req.params.id} was not found`);
  res.send(movie);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(`Error creating a movie: ${error.details[0].message}`);
  
  const genre = await getGenre(req.body.genreId);
  if(!genre) return res.status(400).send('Invalid genre.');

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  try{
    await movie.save()
    res.send(movie);
  }catch(err){
    let errorMessages = '';
    for(field in err.errors){
      errorMessages += err.errors[field].message + '\n';
    }
    res.status(400).send(errorMessages);
  }
});

const getGenre = async function(genreId){
  try{
    const genre = await Genre.find({_id: genreId});
    if(genre.length > 0) return genre[0];
    return null;
  }catch(err){
    return null;
  }
}

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(`Error updating a movie: ${error.details[0].message}`);

  const genre = await getGenre(req.body.genreId);
  if(!genre) return res.status(400).send('Invalid genre.');

  try{
    const movie = await Movie.findByIdAndUpdate(
      req.params.id, 
      {
        title: req.body.title,
        genre:{
          _id: genre._id,
          name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
      }, 
      {useFindAndModify:false, new: true}
    );
    if(!movie) return res.status(404).send(`Movie with id ${req.params.id} was not found`);
    res.send(movie);
  }catch(err){
    console.log(err);
    return res.status(404).send(`Movie with id ${req.params.id} was not found`);
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const movie = await Movie.findByIdAndRemove(req.params.id, {useFindAndModify:false});
    if(!movie) return res.status(404).send(`Movie with id ${req.params.id} was not found`);
    res.send(movie);
  }catch(err){
    return res.status(404).send(`Movie with id ${req.params.id} was not found`);
  }
})

const lookUpMovie = async function(movieId){
  try{
    const movie = await Movie.find({_id: movieId});
    if(movie.length > 0) return movie[0];
    return null;
  }catch(err){
    return null;
  }
}

module.exports = router;