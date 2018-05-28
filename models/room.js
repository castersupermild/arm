const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const logger = require('../logging/logger').appLogger;

const { Schema } = mongoose;

const MATCH_RESULT_WAITING = 0;
const MATCH_RESULT_P1_WIN = 1;
const MATCH_RESULT_P2_WIN = 2;
const MATCH_RESULT_LEFT = 3;

const RoomSchema = new Schema({
  roomId: { type: String, index: true },
  userId1: { type: String, index: true },
  userId2: { type: String, index: true },
  armsName1: { type: String },
  armsName2: { type: String },
  passcode: {
    type: String,
  },
  player1Rating: { type: Number, default: 0 },
  player2Rating: { type: Number, default: 0 },
  player1ChangeRating: { type: Number, default: 0 },
  player2ChangeRating: { type: Number, default: 0 },
  result1: { type: Number, default: MATCH_RESULT_WAITING, index: true },
  result2: { type: Number, default: MATCH_RESULT_WAITING, index: true },
  createdAt: { type: Date, default: Date.now },
});

const Room = mongoose.model('Room', RoomSchema);

function createRoom(user1, user2) {
  logger.info('TODO');
  const roomId = uuidv4();
  const room = new Room({
    roomId,
    userId1: user1.twitterId,
    userId2: user2.twitterId,
    armsName1: user1.armsName,
    armsName2: user2.armsName,
    passcode: String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
  });
  return room.save();
}

function updateRoom(roomId, roomData) {
  return new Promise((resolve, reject) => {
    Room.findOneAndUpdate(
      { roomId },
      roomData,
      {
        new: true,
      },
      (error, room) => {
        if (error) {
          reject(error);
        } else {
          resolve(room);
        }
      }
    );
  });
}

function getRoomById(roomId) {
  return new Promise((resolve, reject) => {
    Room.findOne({ roomId }, (error, room) => {
      if (error) {
        reject(error);
      } else {
        resolve(room);
      }
    });
  });
}

function getRoomsByTwitterId(twitterId) {
  return new Promise((resolve, reject) => {
    Room.find({
      $or: [
        {
          userId1: twitterId,
          result1: MATCH_RESULT_P1_WIN,
          result2: MATCH_RESULT_P1_WIN,
        },
        {
          userId1: twitterId,
          result1: MATCH_RESULT_P2_WIN,
          result2: MATCH_RESULT_P2_WIN,
        },
        {
          userId2: twitterId,
          result1: MATCH_RESULT_P1_WIN,
          result2: MATCH_RESULT_P1_WIN,
        },
        {
          userId2: twitterId,
          result1: MATCH_RESULT_P2_WIN,
          result2: MATCH_RESULT_P2_WIN,
        },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(100)
      .exec((error, rooms) => {
        if (error) {
          reject(error);
        } else {
          resolve(rooms);
        }
      });
  });
}

function getCurrentUserRoom(currentTwitterId) {
  return new Promise((resolve, reject) => {
    Room.find(
      {
        $or: [
          {
            userId1: currentTwitterId,
            result1: MATCH_RESULT_WAITING,
          },
          {
            userId2: currentTwitterId,
            result2: MATCH_RESULT_WAITING,
          },
        ],
      },
      (error, rooms) => {
        if (error) {
          reject(error);
        } else {
          resolve(rooms.length ? rooms[0] : null);
        }
      }
    );
  });
}

module.exports = {
  constants: {
    matchResult: {
      MATCH_RESULT_WAITING,
      MATCH_RESULT_P1_WIN,
      MATCH_RESULT_P2_WIN,
      MATCH_RESULT_LEFT,
    },
  },
  Room,
  createRoom,
  getCurrentUserRoom,
  getRoomById,
  updateRoom,
  getRoomsByTwitterId,
};
