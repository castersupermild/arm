const express = require('express');
const logger = require('../logging/logger').appLogger;

const router = express.Router();
const userModule = require('../models/user');
const roomModule = require('../models/room');
const userHelper = require('../helpers/modules/user');
const matchHelper = require('../helpers/modules/match');

router.get('/', userHelper.isAuthenticated, (req, res /* , next */) => {
  logger.info('TODO: find or create room.');
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
  res.json({ status: true, activeUserCount: matchHelper.countActiveUser() });
});

router.post('/findMatchUser', userHelper.isAuthenticated, async (
  req,
  res /* . next */
) => {
  const currentUser = req.session.user;
  let existsRoom = false;
  if (matchHelper.isMatchReady(currentUser)) {
    const matchRoom = await roomModule.getCurrentUserRoom(
      currentUser.twitterId
    );
    if (matchRoom) {
      existsRoom = true;
      // TODO....
      matchHelper.updateStatusToMatching(currentUser);
    } else {
      const targetTwitterId = matchHelper.findMatchUser(currentUser);
      if (matchHelper.isMatchStatusMatching(currentUser)) {
        existsRoom = true;
      } else if (
        targetTwitterId &&
        !matchHelper.isMatchStatusMatching(targetTwitterId)
      ) {
        matchHelper.updateStatusToMatching(currentUser);
        const targetUser = await userModule.findByTwitterId(targetTwitterId);
        matchHelper.updateStatusToMatching(targetUser);
        const createdRoom = await roomModule.createRoom(
          currentUser.twitterId,
          targetTwitterId
        );
        if (createdRoom) {
          existsRoom = true;
        }
      }
    }
  }
  return res.json({
    existsRoom,
  });
});

router.get('/room', userHelper.isAuthenticated, async (
  req,
  res /* , next */
) => {
  const currentUser = req.session.user;
  const matchRoom = await roomModule.getCurrentUserRoom(currentUser.twitterId);
  if (!matchRoom) {
    res.redirect('/');
    return;
  }

  const player1 = await userModule.findByTwitterId(matchRoom.userId1);
  const player2 = await userModule.findByTwitterId(matchRoom.userId2);
  res.render('match_room', {
    title: 'Rate Match Room',
    room: matchRoom,
    player1,
    player2,
    noPolling: true,
  });
});

module.exports = router;
