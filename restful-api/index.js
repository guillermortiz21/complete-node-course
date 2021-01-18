const debug = require('debug')('app'); // This logs will be shown then env.DEBUG is equal to 'app'
const config = require('config');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./middleware/logger');
const authentication = require('./middleware/authentication');
const express = require('express');
const app = express();

const courses = require('./routes/courses');
const home = require('./routes/home');

// set view engine for pug, express will internally execute pug
app.set('view engine', 'pug');
// path to your views or templates
app.set('views', './views')

app.use(express.json());
app.use(express.urlencoded({extended: true})); // for form-urlencoded payloads
app.use(express.static('public'));
app.use(helmet());
app.use(morgan('tiny'));

// I want logger only if we are on development
if (app.get('env') === 'development'){
  app.use(logger);
  debug('Morgan enabled...');
}
app.use(authentication);

// Configuration
console.log(`Aplication name: ${config.get('name')}`);
console.log(`Mail server: ${config.get('mail.host')}`);
console.log(`Mail password: ${config.get('mail.password')}`);


app.use('/api/courses', courses);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
