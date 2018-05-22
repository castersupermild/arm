const express = require('express');
const logger = require('../logging/logger').appLogger;

const router = express.Router();

router.get('/', (req, res /* , next */) => {
  const count = (req.session.count || 0) + 1;
  req.session.count = count;
  logger.debug(`debug current count: ${req.session.count}`);
  logger.info(`info current count: ${req.session.count}`);
  logger.warn(`warn current count: ${req.session.count}`);
  logger.error(`error current count: ${req.session.count}`);
  res.render('index', {
    title: 'Express',
    uid: req.uid,
    count,
  });
});

module.exports = router;
