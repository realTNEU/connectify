const express = require('express');
const router = express.Router();

// Example route
router.get('/users', (req, res) => {
  res.send('User route');
});

module.exports = router;
