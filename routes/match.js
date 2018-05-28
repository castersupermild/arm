const express = require('express');
const EloRating = require('elo-rating');
const logger = require('../logging/logger').appLogger;

const router = express.Router();
const userModule = require('../models/user');
const roomModule = require('../models/room');
const userHelper = require('../helpers/modules/user');
const matchHelper = require('../helpers/modules/match');

// router.get('/', userHelper.isAuthenticated, (req, res /* , next */) => {
//   logger.info('TODO: find or create room.');
//   res.redirect('/match/room');
// });

router.post('/updateMatchStatus', userHelper.isAuthenticated, async (
  req,
  res /* . next */
) => {
  const { matchStatusReady } = req.body;
  const currentUser = req.session.user;
  const matchRoom = await roomModule.getCurrentUserRoom(currentUser.twitterId);

  if (matchRoom) {
    matchHelper.removeWaitingUser(currentUser);
    res.json({
      status: true,
      roomId: matchRoom.roomId,
    });
    return;
  } else if (matchStatusReady) {
    logger.info(`user[${currentUser.twitterId}] is ready for rate match!`);
    matchHelper.addWaitingUser(currentUser);
  } else {
    logger.info(
      `user[${currentUser.twitterId}] is not ready for rate match...`
    );
    matchHelper.removeWaitingUser(currentUser);
  }
  res.json({
    status: true,
    activeUserCount: matchHelper.countActiveUser(),
  });
});

router.post('/room/result/update', userHelper.isAuthenticated, async (
  req,
  res /* . next */
) => {
  const { roomId, resultCode1, resultCode2 } = req.body;
  const currentUser = req.session.user;

  const room = await roomModule.getRoomById(roomId);

  if (
    !room ||
    (resultCode1 && room.userId1 !== currentUser.twitterId) ||
    (resultCode2 && room.userId2 !== currentUser.twitterId)
  ) {
    logger.error(
      `invalid user or room. req body: ${req.body}, currenUser: ${currentUser}`
    );
    res.status(500).send({ error: 'match result update failed...' });
    return;
  }

  let roomData = null;
  if (resultCode1 && room.userId1 === currentUser.twitterId) {
    roomData = { result1: resultCode1 };
  } else if (resultCode2 && room.userId2 === currentUser.twitterId) {
    roomData = { result2: resultCode2 };
  } else {
    res.status(500).send({ error: 'match result update failed...' });
    return;
  }
  let updatedRoom = await roomModule.updateRoom(roomId, roomData);
  if (
    (updatedRoom.result1 === 1 && updatedRoom.result2 === 1) ||
    (updatedRoom.result1 === 2 && updatedRoom.result2 === 2)
  ) {
    const user1 = await userModule.findByTwitterId(updatedRoom.userId1);
    const user2 = await userModule.findByTwitterId(updatedRoom.userId2);
    const user1Rating = user1.rating;
    const user2Rating = user2.rating;
    const rateData =
      updatedRoom.result1 === 1
        ? EloRating.calculate(user1Rating, user2Rating)
        : EloRating.calculate(user2Rating, user1Rating);

    const player1Rating =
      updatedRoom.result1 === 1
        ? rateData.playerRating
        : rateData.opponentRating;
    const player2Rating =
      updatedRoom.result1 === 2
        ? rateData.playerRating
        : rateData.opponentRating;
    updatedRoom = await roomModule.updateRoom(roomId, {
      player1Rating,
      player2Rating,
      player1ChangeRating: player1Rating - user1Rating,
      player2ChangeRating: player2Rating - user2Rating,
    });
    await userModule.updateUser(user1.twitterId, {
      rating: rateData.playerRating,
    });
    await userModule.updateUser(user2.twitterId, {
      rating: rateData.opponentRating,
    });
  }
  res.json({ status: true, room: updatedRoom });
});

router.post('/findMatchUser', userHelper.isAuthenticated, async (
  req,
  res /* . next */
) => {
  const currentUser = req.session.user;
  let existsRoom = false;
  let matchRoomId = null;
  const matchRoom = await roomModule.getCurrentUserRoom(currentUser.twitterId);
  if (matchRoom) {
    existsRoom = true;
    matchRoomId = matchRoom.roomId;
    matchHelper.removeWaitingUser(currentUser);
  } else {
    const targetTwitterId = matchHelper.findMatchUser(currentUser);
    const targetUser = await userModule.findByTwitterId(targetTwitterId);
    if (
      targetTwitterId &&
      matchHelper.isMatchReady(currentUser) &&
      matchHelper.isMatchReady(targetUser)
    ) {
      matchHelper.removeWaitingUser(currentUser);
      matchHelper.removeWaitingUser(targetUser);
      const createdRoom = await roomModule.createRoom(currentUser, targetUser);
      if (createdRoom) {
        existsRoom = true;
        matchRoomId = createdRoom.roomId;
      }
    }
  }
  return res.json({
    existsRoom,
    roomId: matchRoomId,
  });
});

router.get('/room', async (req, res /* , next */) => {
  const { roomId } = req.query;
  const matchRoom = await roomModule.getRoomById(roomId);
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

router.post('/getLatestRoomInfo', async (req, res /* , next */) => {
  const room = await roomModule.getRoomById(req.body.roomId);
  res.json({
    room,
  });
});

module.exports = router;
