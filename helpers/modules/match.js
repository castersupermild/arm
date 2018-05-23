const userModule = require('../../models/user');

const userConstants = userModule.constants;

const STATUS_WAITING = 1;
const STATUS_MATCHING = 2;

const targetUsers = {};

const matchConnection = (user1, user2) => {
  if (
    user1.matchCondition.connection ===
      userConstants.MATCH_CONDITION_CONNECTION_LAN_ONLY &&
    user2.connectionType === userConstants.CONNECTION_TYPE_WIFI
  ) {
    return false;
  }
  return true;
};

const matchRating = (user1, user2) => {
  if (
    user1.matchCondtion.rating ===
    userConstants.MATCH_CONDITION_RATING_UNLIMITED
  ) {
    return true;
  }

  const computedRating =
    user1.matchCondition.rating ===
    userConstants.MATCH_CONDITION_RATING_WITHIN_100
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
      status: STATUS_WAITING,
      connectionType: user.connectionType,
      rating: user.rating,
      matchCondtion: {
        connection: user.matchConditionConnection,
        rating: user.matchConditionRating,
      },
    };
  },

  removeWaitingUser(user) {
    targetUsers[user.twitterId] = undefined;
  },

  updateStatusToMatching(user) {
    helper.updateStatus(user.twitterId, STATUS_MATCHING);
  },

  updateStatusToWaiting(user) {
    helper.updateStatus(user.twitterId, STATUS_WAITING);
  },

  updateStatus(twitterId, status) {
    const userInfo = targetUsers[twitterId];
    userInfo.status = status;
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
      if (targetUsers[twitterId].status === STATUS_MATCHING) {
        return false;
      }
      return matchCondition(currentUser, targetUsers[twitterId]);
    });
    if (!candidates.length) {
      return null;
    }
    return candidates[Math.floor(Math.random() * candidates.length)].twitterId;
  },
};

module.exports = helper;
