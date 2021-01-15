const EventEmitter = require('events');
const emitter = new EventEmitter();

// We need to register a listener that listens to messageLogged events
emitter.on("messageLogged", (arg) => {
  // This function will be called when the event is raised
  console.log(`Listener called ${JSON.stringify(arg)}`);
});

// Emit is used to raise and event
// Emit is making a noise or producing something
// We are sending a signal that something happened
// You can pass arguments
emitter.emit("messageLogged", {id: 1, url:"http://"});


emitter.on("logging", (arg) => {
  console.log(`Listened to logging: ${JSON.stringify(arg)}`);
});

emitter.emit("logging", {message:"Log this!"});