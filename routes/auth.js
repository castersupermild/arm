const config = require('config');
const express = require('express');

const router = express.Router();
const TwitterStrategy = require('passport-twitter');
const userModule = require('../models/user');
const logger = require('../logging/logger').appLogger;
const userHelper = require('../helpers/modules/user');

router.get('/mypage', userHelper.isAuthenticated, async (
  req,
  res /* , next */
) => {
  if (!userHelper.existsSession(req)) {
    res.redirect('/');
  } else {
    const user = await userModule.findByTwitterId(userHelper.getTwitterId(req));
    req.session.user = user;
    res.render('mypage', {
      title: 'MyPage',
      user,
    });
  }
});

router.post('/mypage/update', userHelper.isAuthenticated, (
  req,
  res /* , next */
) => {
  const params = req.body;
  if (params.twitterId !== userHelper.getTwitterId(req)) {
    throw new Error('omg');
  }
  userModule
    .updateUser(params.twitterId, {
      armsName: params.armsName,
      friendCode: params.friendCode,
      connectionType: params.connectionType,
      matchConditionConnection: params.matchConditionConnection,
      matchConditionRating: params.matchConditionRating,
      publicTwitterUsername: params.publicTwitterUsername,
      introduction: params.introduction,
    })
    .then(user => {
      req.session.user = user;
      res.json(user);
    });
});

const twitterConfig = config.get('twitter');
const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: twitterConfig.get('consumerKey'),
    consumerSecret: twitterConfig.get('consumerSecret'),
    callbackURL: twitterConfig.get('callbackUrl'),
  },
  (accessToken, refreshToken, profile, callback) => {
    userModule
      .registerUser(profile, accessToken, refreshToken)
      .then(() => callback(null, profile))
      .catch(error => {
        logger.error('omg...failed to register user', error);
        return callback(null, profile);
      });
  }
);

module.exports.router = router;
module.exports.twitterStrategy = twitterStrategy;
