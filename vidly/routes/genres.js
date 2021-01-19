const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
const router = express.Router();

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  }
}));

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
  const {error} = validateGenre(req.body);
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
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(`Error updating a genre: ${error.details[0].message}`);

  const genre = await Genre.findByIdAndUpdate(req.params.id, {name: req.body.name}, {useFindAndModify:false, new: true});
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  res.send(genre);
});

router.delete('/:id', async (req, res) => {
  const result = await Genre.findByIdAndRemove(req.params.id, {useFindAndModify:false});
  if(!genre || genre.length === 0) return res.status(404).send(`Genre with id ${req.params.id} was not found`);

  res.send(result);
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

const validateGenre = function(genre){
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });
  return schema.validate(genre);
}

module.exports = router;
