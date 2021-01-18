const Joi = require('joi');
const express = require('express');
const router = express.Router();

const courses = [
  {id: 1, name: 'Course1'},
  {id: 2, name: 'Course2'},
  {id: 3, name: 'Course3'},
]

router.get('/', (req, res) => {
  res.send(courses);
});

// Get a single course
router.get('/:id', (req, res) => {
  const course = courses.find(
    course => course.id === parseInt(req.params.id)
  );
  if(!course) return res.status(404).send(`The course with id ${req.params.id} was not found`);
  res.send(course);
});

// Crea a course
router.post('/', (req, res) => {

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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;