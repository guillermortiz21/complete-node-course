require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');

const express = require('express');
const app = express()

// Start routes and middleware
require('./startup/routes')(app);

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');

;

if(!config.get('jwtPrivateKey')){
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
};

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

winston.add(winston.transports.File, {filename: 'logfile.log'});
winston.add(winston.transports.MongoDB, {
  db: 'mongodb://localhost/vidly',
  level: 'error' //log only error messages to db
});

// playground is the name of the db
// mongo will create it automatically
mongoose.connect('mongodb://localhost:27017/vidly', 
  {useNewUrlParser:true, useUnifiedTopology:true}
)
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => console.log(`Could not connect to mongodb...: ${err.message}`));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
