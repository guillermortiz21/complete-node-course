const _ = require('lodash');
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

  try{
    await user.save();
    // We should not return the password to the client!
    // We use _ for that!
    // The second param is a list of properties
    res.send(_.pick(user, ['_id', 'name', 'email']));
  }catch(err){
    let errorMessages = '';
    for(field in err.errors){
      errorMessages += err.errors[field].message + '\n';
    }
    res.status(400).send(errorMessages);
  }
});

module.exports = router;
