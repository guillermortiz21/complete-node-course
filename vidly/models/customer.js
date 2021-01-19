const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  isGold:{
    type: Boolean,
    default: false
  },
  phone:{
    type: String,
    minlength: 3,
    required: true
  }
}));

const validate = function(customer){
  const schema = Joi.object({
    name: Joi.string().required(),
    isGold: Joi.boolean(),
    phone: Joi.string().required(),
  });
  return schema.validate(customer);
}

module.exports.Customer = Customer;
module.exports.validate = validate;