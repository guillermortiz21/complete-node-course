// This a module for login messages

var url = "http:mylogger.io/log";

function log(message){
  // Send an HTTP request
  console.log(message);
}

// url and log are scoped only to logger.js
// to make it available to other modules

// The module object is a json with properties.
// One of those properties is exports, you can modify it

// With the module.exports you change the public interface of this module

// This will export objects

module.exports.log = log;
module.exports.endPoint = url;

// But you can also export a single function or class like this
// Here the exports stops being a json object and starts being a function.
//module.exports = log;