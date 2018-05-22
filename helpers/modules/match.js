const STATUS_WAITING = 1;
const STATUS_MATCHING = 2;

const targetUsers = {};

const helper = {
  addWaitingUser(
    twitterId,
    connectionType,
    matchConditionConnection,
    matchConditionRating
  ) {
    targetUsers[twitterId] = {
      status: STATUS_WAITING,
      connectionType,
      matchCondtion: {
        matchConditionConnection,
        matchConditionRating,
      },
    };
  },

  updateStatusToMatching(twitterId) {
    helper.updateStatus(twitterId, STATUS_MATCHING);
  },

  updateStatusToWaiting(twitterId) {
    helper.updateStatus(twitterId, STATUS_WAITING);
  },

  updateStatus(twitterId, status) {
    const userInfo = targetUsers[twitterId];
    userInfo.status = status;
  },
};

module.exports = helper;
