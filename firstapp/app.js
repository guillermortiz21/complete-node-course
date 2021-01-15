const http = require('http');

const server = http.createServer();
// The server inherits from net.Server
// net.Server is an EventEmitter
// therefore server is an EventEmitter
// You can find the on and emit methods inside server.

server.on("connection", (socket) => {
  console.log(`New connection`);
});

// Lets listen to the port 3000
server.listen(3000);
console.log("Listening on port 3000...");