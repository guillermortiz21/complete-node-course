const winston = require('winston');

module.exports = function(err, req, res, next){
  winston.error(err.message, err); // Second param is metadata.
  res.status(500).send('Something failed!.');
}