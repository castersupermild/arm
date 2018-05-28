const mongoose = require('mongoose');

const { Schema } = mongoose;

const LANG_EN = 'en';
const LANG_EN_US = 'en-US';
const LANG_EN_GB = 'en-GB';
const LANG_JA = 'ja';

const STATUS_ACTIVE = 1;
const STATUS_DELETED = 2;

const CONNECTION_TYPE_LAN = 1;
const CONNECTION_TYPE_WIFI = 2;

const MATCH_CONDITION_CONNECTION_LAN_ONLY = 1;
const MATCH_CONDITION_CONNECTION_WIRELESS_OK = 2;

const MATCH_CONDITION_RATING_UNLIMITED = 1;
const MATCH_CONDITION_RATING_WITHIN_100 = 2;
const MATCH_CONDITION_RATING_WITHIN_200 = 3;

function getConnectionTypeLabels() {
  return {
    [CONNECTION_TYPE_LAN]: '有線',
    [CONNECTION_TYPE_WIFI]: '無線',
  };
}

function getMatchConditionConnectionLabels() {
  return {
    [MATCH_CONDITION_CONNECTION_LAN_ONLY]: '有線ユーザ限定で対戦する',
    [MATCH_CONDITION_CONNECTION_WIRELESS_OK]: '無線ユーザとも対戦する',
  };
}

function getMatchConditionRatingLabels() {
  return {
    [MATCH_CONDITION_RATING_UNLIMITED]: '制限なし',
    [MATCH_CONDITION_RATING_WITHIN_100]: 'レート差が100以内限定',
    [MATCH_CONDITION_RATING_WITHIN_200]: 'レート差が200以内限定',
  };
}

function getLanguageLabels() {
  return {
    LANG_EN,
    LANG_EN_US,
    LANG_EN_GB,
    LANG_JA,
  };
}

const UserSchema = new Schema({
  twitterId: { type: String, index: true },
  username: String,
  image: String,
  twitterName: { type: String, index: true },
  armsName: { type: String, index: true },
  rating: { type: Number, default: 1500, index: true },
  friendCode: String,
  connectionType: { type: Number, default: CONNECTION_TYPE_WIFI },
  matchConditionConnection: {
    type: Number,
    default: MATCH_CONDITION_CONNECTION_WIRELESS_OK,
  },
  matchConditionRating: {
    type: Number,
    default: MATCH_CONDITION_RATING_UNLIMITED,
  },
  accessToken: String,
  refreshToken: String,
  lang: {
    type: String,
    enum: Object.values(getLanguageLabels()),
    default: LANG_JA,
  },
  status: { type: Number, required: true, default: STATUS_ACTIVE, index: true },
  createdAt: { type: Date, default: Date.now },
  publicTwitterUsername: { type: Boolean, default: 0 },
  admin: { type: Boolean, default: 0, index: true },
});

const User = mongoose.model('User', UserSchema);

function registerUser(profile, accessToken, refreshToken) {
  const photoData = (profile.photos || [])[0] || {};
  const image = photoData.value || null;
  const userData = {
    twitterId: profile.id,
    username: profile.username,
    twitterName: profile.displayName,
    image,
    accessToken,
    refreshToken,
  };
  return User.findOneAndUpdate({ twitterId: userData.twitterId }, userData, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}

function updateUser(twitterId, userData) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate(
      { twitterId },
      userData,
      {
        new: true,
      },
      (error, user) => {
        if (error) {
          reject(error);
        } else {
          resolve(user);
        }
      }
    );
  });
}

function findByTwitterId(twitterId) {
  return new Promise((resolve, reject) => {
    User.findOne({ twitterId }, (error, user) => {
      if (error) {
        reject(error);
      } else {
        resolve(user);
      }
    });
  });
}

function getUsersSortByRating(count) {
  return new Promise((resolve, reject) => {
    User.find({})
      .sort({ rating: -1 })
      .limit(count)
      .exec((error, users) => {
        if (error) {
          reject(error);
        } else {
          resolve(users);
        }
      });
  });
}

module.exports = {
  Constants: {
    lang: {
      LANG_EN,
      LANG_EN_US,
      LANG_EN_GB,
      LANG_JA,
    },
    status: {
      STATUS_ACTIVE,
      STATUS_DELETED,
    },
    connectionType: {
      CONNECTION_TYPE_LAN,
      CONNECTION_TYPE_WIFI,
    },
    matchCondition: {
      connection: {
        LAN_ONLY: MATCH_CONDITION_CONNECTION_LAN_ONLY,
        WIRELESS_OK: MATCH_CONDITION_CONNECTION_WIRELESS_OK,
      },
      rating: {
        UNLIMITED: MATCH_CONDITION_RATING_UNLIMITED,
        WITHIN_100: MATCH_CONDITION_RATING_WITHIN_100,
        WITHIN_200: MATCH_CONDITION_RATING_WITHIN_200,
      },
    },
  },
  User,
  registerUser,
  updateUser,
  findByTwitterId,
  getConnectionTypeLabels,
  getMatchConditionConnectionLabels,
  getMatchConditionRatingLabels,
  getUsersSortByRating,
};
