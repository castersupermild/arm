const mongoose = require('mongoose');

const STATUS_READY = 1;
const STATUS_ACTIVE = 2;
const STATUS_FINISHED = 3;

const EventSchema = new mongoose.Schema({
  name: { type: String },
  introduction: { type: String },
  from: { type: Date, index: true },
  to: { type: Date, index: true },
  status: { type: Number, required: true, default: STATUS_READY, index: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = {
  constants: {
    STATUS_READY,
    STATUS_ACTIVE,
    STATUS_FINISHED,
  },
  Event: mongoose.model('Event', EventSchema),
};
