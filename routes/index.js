const express = require('express');

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  const count = (req.session.count || 0) + 1;
  req.session.count = count;
  res.render('index', {
    title: 'Name TBD...',
    count,
  });
});

module.exports = router;
