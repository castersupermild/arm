const userModule = require('../../models/user');

const userConstants = userModule.Constants;

const targetUsers = {};

const matchConnection = (user1, user2) => {
  if (
    user1.matchConditionConnection ===
      userConstants.matchCondition.connection.LAN_ONLY &&
    user2.connectionType === userConstants.connectionType.CONNECTION_TYPE_WIFI
  ) {
    return false;
  }
  return true;
};

const matchRating = (user1, user2) => {
  if (
    user1.matchCondtionRating === userConstants.matchCondition.rating.UNLIMITED
  ) {
    return true;
  }

  const computedRating =
    user1.matchConditionRating ===
    userConstants.matchCondition.rating.WITHIN_100
      ? 100
      : 200;

  const rating1 = user1.rating;
  const ratingOver = user2.rating + computedRating;
  const ratingMinus = user2.rating - computedRating;
  return rating1 <= ratingOver && rating1 >= ratingMinus;
};

const matchCondition = (user1, user2) => {
  if (!matchConnection(user1, user2) || !matchConnection(user2, user1)) {
    return false;
  }

  if (!matchRating(user1, user2) || !matchRating(user2, user1)) {
    return false;
  }

  return true;
};

const helper = {
  addWaitingUser(user) {
    targetUsers[user.twitterId] = {
      twitterId: user.twitterId,
      // status: STATUS_WAITING,
      connectionType: user.connectionType,
      rating: user.rating,
      matchConditionConnection: user.matchConditionConnection,
      matchConditionRating: user.matchConditionRating,
    };
  },

  updateUserInfo(user) {
    const targetUser = targetUsers[user.twitterId];
    if (targetUser) {
      targetUser.connectionType = user.connectionType;
      targetUser.rating = user.rating;
      targetUser.matchConditionConnection = user.matchConditionConnection;
      targetUser.matchConditionRating = user.matchConditionRating;
    }
  },

  removeWaitingUser(user) {
    delete targetUsers[user.twitterId];
  },

  isMatchReady(user) {
    return !!targetUsers[user.twitterId];
  },

  findMatchUser(currentUser) {
    const currentTwitterId = currentUser.twitterId;
    const candidates = Object.keys(targetUsers).filter(twitterId => {
      if (twitterId === currentTwitterId) {
        return false;
      }
      return matchCondition(currentUser, targetUsers[twitterId]);
    });
    if (!candidates.length) {
      return null;
    }
    return targetUsers[
      candidates[Math.floor(Math.random() * candidates.length)]
    ].twitterId;
  },

  countActiveUser() {
    return Object.keys(targetUsers).length;
  },
};

module.exports = helper;
