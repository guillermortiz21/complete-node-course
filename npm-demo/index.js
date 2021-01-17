const _ = require("underscore");

const result = _.contains([1,2,3], 2);
console.log(result);
 
const my_package = require('my-package-1234');
const sum = my_package.add(2,3);
console.log(sum);

const mul = my_package.multiply(2,3);
console.log(mul); 