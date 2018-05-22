const express = require('express');
const logger = require('../logging/logger').appLogger;

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  logger.info('TODO: find or create room.');
  res.redirect('/match/room');
});

router.get('/room', (req, res /* , next */) => {
  res.render('match_room', {
    title: 'Rate Match Room',
  });
});

module.exports = router;
