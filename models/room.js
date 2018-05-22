const moment = require('moment');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const STATUS_READY = 1;
const STATUS_ACTIVE = 2;
const STATUS_FINISHED = 3;
const STATUS_INVALID = 4;

const DEFAULT_WAITING_TIME = 10;

const RoomSchema = new mongoose.Schema({
  eventId: { type: Schema.Types.ObjectId, index: true },
  userId1: { type: Schema.Types.ObjectId, index: true },
  userId2: { type: Schema.Types.ObjectId, index: true },
  waitingLimit: {
    type: Date,
    default: moment().add(DEFAULT_WAITING_TIME, 'minute'),
  },
  winner: { type: Schema.Types.ObjectId },
  loser: { type: Schema.Types.ObjectId },
  status: { type: Number, required: true, default: STATUS_READY, index: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  constants: {
    STATUS_READY,
    STATUS_ACTIVE,
    STATUS_FINISHED,
    STATUS_INVALID,
  },
  Room: mongoose.model('Room', RoomSchema),
};
