const winston = require('winston');

module.exports = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports:[
    new winston.transports.Console(),
    new winston.transports.File({filename: 'logFile.log'})
  ]
});