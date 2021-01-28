require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');

// Here is all the code related to log data.
module.exports = function(){
  winston.add(winston.transports.File, {filename: 'logfile.log'});
  winston.add(winston.transports.MongoDB, {
    db: 'mongodb://localhost/vidly',
    level: 'error' //log only error messages to db
  });

  // Get sync exceptions that were not caught
  process.on('uncaughtException', async (ex) => {
    console.log('UNCAUGHT EXCEPTION');
    winston.error(ex.message, ex);
    // The best practice is to termine the process and restart it.
    // Wait for winston to finish logging
    setTimeout(() => {process.exit(1);}, 1000)
  });

  // Get async exceptions that were not caught
  process.on('unhandledRejection', (ex) => {
    console.log('UNHANDLED EXCEPTION');
    winston.error(ex.message, ex);
    // The best practice is to termine the process and restart it.
    // Wait for winston to finish logging
    setTimeout(() => {process.exit(1);}, 1000);
  });
}