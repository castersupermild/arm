const express = require('express');
const logger = require('../logging/logger').appLogger;

const router = express.Router();
const roomModule = require('../models/room');
const userHelper = require('../helpers/modules/user');

const roomConstants = roomModule.constants;

router.get('/', (req, res /* , next */) => {
  if (!userHelper.existsSession(req)) {
    res.redirect('/');
    return;
  }
  logger.info('TODO: find or create room.');
  const currentTwitterId = userHelper.getTwitterId(req);
  roomModule.Room.find(
    {
      $or: [
        {
          userId1: currentTwitterId,
          status1: { $ne: roomConstants.roomStatus.STATUS_LEFT },
        },
        {
          userId2: currentTwitterId,
          status2: { $ne: roomConstants.roomStatus.STATUS_LEFT },
        },
      ],
    },
    (error, room) => {
      logger.info(room);
    }
  );
  res.redirect('/match/room');
});

router.get('/room', (req, res /* , next */) => {
  if (!userHelper.existsSession(req)) {
    res.redirect('/');
    return;
  }
  res.render('match_room', {
    title: 'Rate Match Room',
    player1: {
      armsName: 'abc',
    },
    player2: {
      armsName: 'Omg',
    },
  });
});

module.exports = router;
