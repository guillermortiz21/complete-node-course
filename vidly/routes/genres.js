const {Genre, validate} = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

router.get('/:id', async (req, res) => {
  const genre = await lookUpGenre(req.params.id);
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  res.send(genre);
});

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(`Error creating a genre: ${error.details[0].message}`);
  
  let genre = new Genre({name: req.body.name});

  try{
    genre = await genre.save()
    res.send(genre);
  }catch(err){
    let errorMessages = '';
    for(field in err.errors){
      errorMessages += err.errors[field].message + '\n';
    }
    res.status(400).send(errorMessages);
  }
});

router.put('/:id', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(`Error updating a genre: ${error.details[0].message}`);
  try{
    const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {useFindAndModify:false, new: true});
    if(!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);
    res.send(genre);
  }catch(err){
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  }
});

router.delete('/:id', async (req, res) => {
  try{
    const result = await Genre.findByIdAndRemove(req.params.id, {useFindAndModify:false});
    if(!result) return res.status(404).send(`Genre with id ${req.params.id} was not found`);
    res.send(result);
  }catch(err){
    return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  }
});

const lookUpGenre = async function(genreId){
  try{
    const genre = await Genre.find({_id: genreId});
    if(genre.length > 0) return genre[0];
    return null;
  }catch(err){
    return null;
  }
}

module.exports = router;
