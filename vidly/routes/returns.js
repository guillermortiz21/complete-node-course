const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async(req, res) => {
  if(!req.body.customerId) return res.status(400).send('customerId was provided');
  if(!req.body.movieId) return res.status(400).send('movieId was provided');
  res.send('posted');
});

module.exports = router;