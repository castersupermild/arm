const mongoose = require('mongoose');
const logger = require('../logging/logger').appLogger;

const { Schema } = mongoose;

const STATUS_NOT_READY = 1;
const STATUS_READY = 2;
const STATUS_LEFT = 3;

const MATCH_RESULT_WAITING = 0;
const MATCH_RESULT_P1_WIN = 1;
const MATCH_RESULT_P2_WIN = 2;
const MATCH_RESULT_DRAW = 3;
const MATCH_RESULT_INVALID = 4;

const RoomSchema = new Schema({
  roomId: { type: String, index: true },
  userId1: { type: String, index: true },
  userId2: { type: String, index: true },
  passcode: { type: String },
  status1: {
    type: Number,
    required: true,
    default: STATUS_NOT_READY,
    index: true,
  },
  status2: {
    type: Number,
    required: true,
    default: STATUS_NOT_READY,
    index: true,
  },
  result1: { type: Number, default: MATCH_RESULT_WAITING, index: true },
  result2: { type: Number, default: MATCH_RESULT_WAITING, index: true },
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', RoomSchema);

function getCurrentUserRoom(currentTwitterId) {
  return new Promise((resolve, reject) => {
    Room.find(
      {
        $or: [
          {
            userId1: currentTwitterId,
            status1: { $ne: STATUS_LEFT },
          },
          {
            userId2: currentTwitterId,
            status2: { $ne: STATUS_LEFT },
          },
        ],
      },
      (error, rooms) => {
        if (error) {
          reject(error);
        } else {
          resolve(rooms);
        }
      }
    );
  });
}

module.exports = {
  constants: {
    roomStatus: {
      STATUS_NOT_READY,
      STATUS_READY,
      STATUS_LEFT,
    },
    matchResult: {
      MATCH_RESULT_P1_WIN,
      MATCH_RESULT_P2_WIN,
      MATCH_RESULT_DRAW,
      MATCH_RESULT_INVALID,
    },
  },
  Room,
};
