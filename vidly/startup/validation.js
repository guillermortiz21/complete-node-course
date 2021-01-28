const Joi = require('joi');

// Here is the code related to Joi validations.
module.exports = function(){
  Joi.objectId = require('joi-objectid')(Joi);
}
