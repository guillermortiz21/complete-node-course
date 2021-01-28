require('dotenv').config();

// Here is the code related to configurations.
module.exports = function(){
  if(!process.env.jwtPrivateKey){
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  };
}
