const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // use pug to render!
  // the object has the properties in index.pug
  res.render('index', {
    title: 'My express app',
    message: 'Hello'
  });
});

module.exports = router;