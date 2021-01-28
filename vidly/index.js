const config = require('config');

const express = require('express');
const app = express()

// Start the loggers
require('./startup/logging')();

// Start database
require('./startup/db')();

// Start routes and middleware
require('./startup/routes')(app);

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


if(!config.get('jwtPrivateKey')){
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
