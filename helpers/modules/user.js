const userModule = require('../../models/user');

const helper = {
  existsSession: req =>
    !!req.session && !!req.session.passport && !!req.session.passport.user,

  hasUserInSession: req => helper.existsSession(req) && req.session.user,

  getUser: req => {
    if (!helper.hasUserInSession(req)) {
      return null;
    }
    return req.session.user;
  },

  getPassportUser: req => {
    if (!helper.existsSession(req)) {
      return null;
    }
    return req.session.passport.user;
  },

  getTwitterId: req => {
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
};

module.exports = helper;
