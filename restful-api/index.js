const express = require('express');
const app = express();

app.use(express.json());

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
  if(!course) res.status(404).send(`The course with id ${req.params.id} was not found`);
  res.send(course);
});

// Crea a course
app.post('/api/courses', (req, res) => {
  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  // By convention, we respond the client with the created object
  res.send(course);
});

// Two params!
app.get('/api/posts/:year/:month', (req, res) => {
  res.send({params: req.params, query: req.query});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));