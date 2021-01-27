const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const {User, validate} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const {error} = validate(req.body);
  if(error) return res.status(400).send(`Error creating a user: ${error.details[0].message}`);
  
  // Check user is not already registered
  let user = await User.findOne({email: req.body.email});
  if(user) return res.status(400).send('User already registered');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const saltRounds = 10;
  user.password = await bcrypt.hash(user.password, saltRounds);

  try{
    await user.save();
    // We should not return the password to the client!
    // We use _ for that!
    // The second param is a list of properties

    // send back a jwt in the header
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  }catch(err){
    let errorMessages = '';
    for(field in err.errors){
      errorMessages += err.errors[field].message + '\n';
    }
    res.status(400).send(errorMessages);
  }
});

module.exports = router;
