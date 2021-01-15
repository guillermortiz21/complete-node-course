const fs = require('fs');

// Get all files and folders in current folder
console.log(fs.readdirSync('./'));

fs.readdir('./', (err, files) => {
  if(err) console.log(`Error: ${err}`);
  else console.log(`Result: ${files}`);
});