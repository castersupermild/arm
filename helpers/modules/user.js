const userModule = require('../../models/user');
const matchHelper = require('./match');

const helper = {
  existsSession: req =>
    !!req.session && !!req.session.passport && !!req.session.passport.user,

  hasUserInSession: req => helper.existsSession(req) && req.session.user,

  getUser(req) {
    if (!helper.hasUserInSession(req)) {
      return null;
    }
    return req.session.user;
  },

  getPassportUser(req) {
    if (!helper.existsSession(req)) {
      return null;
    }
    return req.session.passport.user;
  },

  getTwitterId(req) {
    const user = helper.getPassportUser(req);
    return user && user.id;
  },

  getConnectionTypeLabel(connectionType) {
    return userModule.getConnectionTypeLabels()[connectionType];
  },

  getMatchConditionRatingLabel(ratingType) {
    return userModule.getMatchConditionRatingLabels()[ratingType];
  },

  getMatchConditionConnectionLabels(connectionType) {
    return userModule.getMatchConditionConnectionLabels()[connectionType];
  },

  getActiveUserCount() {
    return matchHelper.countActiveUser();
  },

  isMatchReady(req) {
    const user = helper.getUser(req);
    if (!user) {
      return false;
    }
    return matchHelper.isMatchReady(user);
  },

  // eslint-disable-next-line consistent-return
  isAuthenticated(req, res, next) {
    if (!helper.existsSession(req)) {
      const contentType = req.get('Content-Type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        res.status(403).send({ error: 'please login' });
      } else {
        res.redirect('/');
      }
    } else {
      return next();
    }
  },
};

module.exports = helper;
