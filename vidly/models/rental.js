const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

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
      title: {type: String, minlength: 3, maxlength: 255, required: true, trim: true},
      dailyRentalRate:{type: Number, min:0, max:255, required: true, default: 0}
    }), 
    required:true
  },
  dateOut: {type: Date, default: Date.now, required: true},
  dateReturned: {type: Date},
  rentalFee: {type: Number, min: 0}
});

rentalSchema.statics.lookup = function(customerId, movieId){
  return this.findOne({
    'customer._id': customerId,
    'movie._id': movieId
  });
}

rentalSchema.methods.return = function(){
  // set the dateReturned date
  this.dateReturned = new Date();
  
  // set the rental fee
  const rentalDays = moment().diff(this.dateOut, 'days')
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

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
