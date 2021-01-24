const mongoose = require('mongoose');
const Joi = require('joi');

// A rental has a customer and a movie

const rentalSchema = new mongoose.Schema({
  customer:{
    type: new mongoose.Schema({
      name: {type: String,minlength: 3,required: true},
      isGold:{type: Boolean, default: false},
      phone:{type: String,minlength: 3,required: true}
    }),
    required: true
  },
  movie:{
    type: new mongoose.Schema({
      title: {type: String, minlength: 3, maxLength: 255, required: true, trim: true},
      dailyRentalRate:{type: Number, min:0, max:255, required: true, default: 0}
    }), 
    required:true
  },
  dateOut: {type: Date, default: Date.now, required: true},
  dateReturned: {type: Date},
  rentalFee: {type: Number, min: 0}
});

const Rental = mongoose.model('Rental', rentalSchema);

const validate = function(rental){
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });
  return schema.validate(rental);
}

module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;
module.exports.validate = validate;
