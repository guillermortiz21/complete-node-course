const _ = require('lodash');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(`Error creating a user: ${error.details[0].message}`);
  
  // Check user is not already registered
  let user = await User.findOne({email: req.body.email});
  if(!user) return res.status(400).send('Invalid email or password');
  
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if(!validPassword) return res.status(400).send('Invalid email or password');

  // The login is valid!
  // Create jwt
  const token = user.generateAuthToken();
  res.send(token);
});

function validate(req){
  const schema = Joi.object({
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  });
  return schema.validate(req);
};

module.exports = router;
