const Joi = require('joi');
const logger = require('./logger');
const authentication = require('./authentication');
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true})); // for form-urlencoded payloads
app.use(express.static('public'));
app.use(logger);
app.use(authentication);
 
const courses = [
  {id: 1, name: 'Course1'},
  {id: 2, name: 'Course2'},
  {id: 3, name: 'Course3'},
]

// Lets do a get request

app.get('/', (req, res) => {
  res.send('Hello world!!!');
});

app.get('/api/courses', (req, res) => {
  res.send(courses);
});

// Get a single course
app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(
    course => course.id === parseInt(req.params.id)
  );
  if(!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);
  res.send(course);
});

// Crea a course
app.post('/api/courses', (req, res) => {

  // Input validation!
  const {error} = validateCourse(req.body);
  
  if(error){
    const errorMessages = getValidationErrorMessages(error);
    // 400 error, bad request
    return res.status(400).send(errorMessages);
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  // By convention, we respond the client with the created object
  res.send(course);
});

// Lets update a course
app.put('/api/courses/:id', (req, res) => {
  // Find the course with that id
  const course = courses.find(
    course => course.id === parseInt(req.params.id)
  );

  // If it doesn't exist, return 404
  if(!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

  // Validate
  const {error} = validateCourse(req.body);
  
  if(error){
    const errorMessages = getValidationErrorMessages(error);
    // If not valid, return 400 - Bad request
    return res.status(400).send(errorMessages);
  }

  // Update course
  course.name = req.body.name;
  // Return the updated course
  res.send(course);
});

// Delete course
app.delete('/api/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find(
    course => course.id === parseInt(req.params.id)
  );

  // If it doesn't exist, return 404
  if(!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

// Two params!
app.get('/api/posts/:year/:month', (req, res) => {
  res.send({params: req.params, query: req.query});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

function validateCourse(course){
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  })
  
  return schema.validate(course); 
}

function getValidationErrorMessages(validationErrors){
  // Iterate through the error details array
  // and get all the error messages.
  return validationErrors.details.reduce(
    (acum, detail) => acum + detail.message + '\n', ""
  );
}