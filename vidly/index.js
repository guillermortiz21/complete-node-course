const express = require('express');
const app = express()

// Start the loggers
require('./startup/logging')();

// Start the configurations
require('./startup/config')();

// Start database
require('./startup/db')();

// Start routes and middleware
require('./startup/routes')(app);

const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
