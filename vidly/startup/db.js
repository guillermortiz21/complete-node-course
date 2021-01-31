const mongoose = require('mongoose');
const winston = require('winston');

// Heres is all the code related to the database
module.exports = function(){
  mongoose.set('useCreateIndex',true);
  // playground is the name of the db
  // mongo will create it automatically
  mongoose.connect(process.env.DB, 
    {useNewUrlParser:true, useUnifiedTopology:true}
  )
  .then(() => winston.info(`Connected to ${process.env.DB}`))
  .catch((err) => {
    throw new Error(err);
  })
}