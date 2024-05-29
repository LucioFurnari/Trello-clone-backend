const express = require('express');
const router = express.Router();

router.post('/user', (req, res) => {
  res.send('Placeholder for POST user endpoint')
});

router.get('/user', (req, res) => {
  res.send('Placeholder for GET user endpoint')
});

module.exports = router;