const express = require('express');
const app = express();

// Lets do a get request

app.get('/', (req, res) => {
  res.send('Hello world!!!');
});

app.get('/api/courses', (req, res) => {
  res.send([1,2,3]);
});

// Get a single course
app.get('/api/courses/:id', (req, res) => {
  res.send(req.params.id);
});

// Two params!
app.get('/api/posts/:year/:month', (req, res) => {
  res.send({params: req.params, query: req.query});
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));