global.console.log("Hello");
console.log("world");

var myVar = "I am not in the global object";
global.console.log(myVar);
global.console.log(global.myVar); // Prints undefined
