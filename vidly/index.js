const config = require('config');
const error = require('./middleware/error');
require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const home = require('./routes/home');
const express = require('express');
const app = express();

if(!config.get('jwtPrivateKey')){
  console.log('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
};

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
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

// Error middleware
app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}...`));
