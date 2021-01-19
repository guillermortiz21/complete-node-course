const mongoose = require('mongoose');
const genres = require('./routes/genres');
const home = require('./routes/home');
const express = require('express');
const app = express();

// playground is the name of the db
// mongo will create it automatically
mongoose.connect('mongodb://localhost:27017/vidly', 
  {useNewUrlParser:true, useUnifiedTopology:true}
)
  .then(() => console.log('Connected to mongodb'))
  .catch((err) => console.log(`Could not connect to mongodb...: ${err.message}`));

app.use(express.json());

app.use('/', home);
app.use('/api/genres', genres);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
