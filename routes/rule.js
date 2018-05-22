const express = require('express');

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  res.render('rule', {
    title: 'Rate Match Rules',
  });
});

module.exports = router;
