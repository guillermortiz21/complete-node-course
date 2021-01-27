const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const passwordComplexity = require("joi-password-complexity");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function(){
  const token = jwt.sign(
    {_id: this._id, isAdmin: this.isAdmin}, 
    config.get('jwtPrivateKey')
  );
  return token;
}

const User = mongoose.model('User', userSchema);

const validate = function(user){

  const passwordComplexityOptions = {
    min: 3,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1
  }

  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(3).max(255).required().email(),
    password: Joi.string().min(3).max(30).required()
  });
  const validation = schema.validate(user);
  if(validation.error) return validation;
  return passwordComplexity(passwordComplexityOptions, 'password').validate(user.password);
};

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validate;