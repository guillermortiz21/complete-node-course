const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres = [
  {id: 1, genre:'Action'},
  {id: 2, genre:'Animation'},
  {id: 3, genre:'Horror'}
]

router.get('/', (req, res) => {
  res.send(genres);
});

router.get('/:id', (req, res) => {
  const genre = lookUpGenre(req.params.id);
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);
  res.send(genre);
});

router.post('/', (req, res) => {
  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(`Error creating a genre: ${error.details[0].message}`);
  const genre = {
    id: genres.length + 1,
    genre: req.body.genre
  };
  genres.push(genre);
  res.send(genre);
});

router.put('/:id', (req, res) => {
  const genre = lookUpGenre(req.params.id);
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);

  const {error} = validateGenre(req.body);
  if(error) return res.status(400).send(`Error updating a genre: ${error.details[0].message}`);

  genre.genre = req.body.genre;
  res.send(genre);
});

router.delete('/:id', (req, res) => {
  const genre = lookUpGenre(req.params.id);
  if(!genre) return res.status(404).send(`Genre with id ${req.params.id} was not found`);

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

const lookUpGenre = function(genreId){
  const genre = genres.find(
    (genre) => genre.id === parseInt(genreId)
  );
  return genre;
}

const validateGenre = function(genre){
  const schema = Joi.object({
    genre: Joi.string().min(3).required()
  });
  return schema.validate(genre);
}

module.exports = router;
