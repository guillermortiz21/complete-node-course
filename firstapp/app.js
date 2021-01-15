const os = require("os");

console.log(os.userInfo());
console.log(`Total memory: ${os.totalmem()}`);
console.log(`Free memory: ${os.freemem()}`);