const logger = function(req, res, next){
  console.log('Logging...');
  next();
}

module.exports = logger;
