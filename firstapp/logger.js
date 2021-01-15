const EventEmitter = require('events');

class Logger extends EventEmitter{
  constructor(){
    super();
    this.url = "http:mylogger.io/log";
  }

  log(message){
    // Send an HTTP request
    console.log(message);
    // Emit comes from EventEmitter
    this.emit("messageLogged", {id: 1, url:"http://"});
  }
}

module.exports = Logger;