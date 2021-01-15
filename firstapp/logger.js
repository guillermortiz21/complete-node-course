// The module wrapper function is a function that wraps all the modules like this:
/*(function(exports, require, module, __filename, __dirname){
  // Your module code goes here
  // This wrapper function is why the objects module, exports, require, __filename and __dirname are available inside the modules. 
})*/


// Its because of the wrapper function that all these objects are available!
console.log(exports);
console.log(require);
console.log(module);
console.log(__filename);
console.log(__dirname);


var url = "http:mylogger.io/log";

function log(message){
  // Send an HTTP request
  console.log(message);
}

module.exports = log;