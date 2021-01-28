const winston = require('winston');

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

// Start joi validations
require('./startup/validation');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => winston.info(`Listening to port ${PORT}...`));
