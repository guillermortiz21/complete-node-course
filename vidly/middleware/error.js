const winston = require('../utils/winston');

module.exports = function(err, req, res, next){
  // Lets log the error to winston
  // the error can be of one level:
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
  winston.error(err.message, err); // Second param is metadata.
  res.status(500).send('Something failed!.');
}