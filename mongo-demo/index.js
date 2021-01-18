// Connect to mongo db

const mongoose = require('mongoose');
// playground is the name of the db
// mongo will create it automatically
mongoose.connect('mongodb://localhost/playground', 
  {useNewUrlParser:true, useUnifiedTopology:true}
)
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => console.log(`Could not connect to mongodb...: ${err.message}`));

