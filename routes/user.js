const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/user',
  body('username')
  .notEmpty()
  .trim(),
  (req, res) => {
    const result = validationResult(req);

    if (result.isEmpty()) {
      return res.json({
        'message': 'User created !'
      })
    }
    return res.json({ error: true });
  }
);

router.get('/user', (req, res) => {
  res.send('Placeholder for GET user endpoint')
});

module.exports = router;