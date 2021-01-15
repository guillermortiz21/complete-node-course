const Logger = require('./Logger');
const logger = new Logger();

// We need to register a listener that listens to messageLogged events
logger.on("messageLogged", (arg) => {
  // This function will be called when the event is raised
  console.log(`Listener called ${JSON.stringify(arg)}`);
});

logger.log("This is a message");