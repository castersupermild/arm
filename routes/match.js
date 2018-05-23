const express = require('express');
const logger = require('../logging/logger').appLogger;

const router = express.Router();
const roomModule = require('../models/room');
const userHelper = require('../helpers/modules/user');
const matchHelper = require('../helpers/modules/match');

const roomConstants = roomModule.constants;

router.get('/', userHelper.isAuthenticated, (req, res /* , next */) => {
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

router.post('/updateMatchStatus', userHelper.isAuthenticated, (
  req,
  res /* . next */
) => {
  const { matchStatusReady } = req.body;
  const currentUser = req.session.user;

  if (matchStatusReady) {
    logger.info(`user[${currentUser.twitterId}] is ready for rate match!`);
    matchHelper.addWaitingUser(currentUser);
  } else {
    logger.info(
      `user[${currentUser.twitterId}] is not ready for rate match...`
    );
    matchHelper.removeWaitingUser(currentUser);
  }
  res.json({ status: true });
});

router.post('/findMatchUser', userHelper.isAuthenticated, async (
  req,
  res /* . next */
) => {
  const currentUser = req.session.user;
  let roomId = null;
  if (matchHelper.isMatchReady(currentUser)) {
    const matchRoom = await roomModule.getCurrentUserRoom(
      currentUser.twitterId
    );
    if (matchRoom) {
      // eslint-disable-next-line prefer-destructuring
      roomId = matchRoom.roomId;
    } else {
      const targetTwitterId = matchHelper.findMatchUser(currentUser);
      if (targetTwitterId) {
        const createdRoom = await roomModule.createRoom(
          currentUser.twitterId,
          targetTwitterId
        );
        // eslint-disable-next-line prefer-destructuring
        roomId = createdRoom.roomId;
      }
    }
  }
  return res.json({
    roomId,
  });
});

router.get('/room', userHelper.isAuthenticated, (req, res /* , next */) => {
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
