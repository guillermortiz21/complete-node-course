require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');

const express = require('express');
const app = express()

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

winston.add(winston.transports.File, {filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, {
  db: 'mongodb://localhost/vidly',
  level: 'error' //log only error messages to db
});

// Get sync exceptions that were not caught
process.on('uncaughtException', (ex) => {
  console.log('UNCAUGHT EXCEPTION');
  winston.error(ex.message, ex);
  // The best practice is to termine the process and restart it.
  process.exit(1);
});

// Get async exceptions that were not caught
process.on('unhandledRejection', (ex) => {
  console.log('UNHANDLED EXCEPTION');
  winston.error(ex.message, ex);
  // The best practice is to termine the process and restart it.
  process.exit(1);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
