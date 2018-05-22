const express = require('express');
const logger = require('../logging/logger').appLogger;

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  logger.info('TODO: find or create room.');
  res.render('admin/index', {
    title: 'Admin Index',
  });
});

router.get('/event_conrtol', (req, res /* , next */) => {
  res.render('event_control', {
    title: 'Event Control',
  });
});

module.exports = router;
