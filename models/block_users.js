const mongoose = require('mongoose');

const { Schema } = mongoose;

const BlockUsersSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, index: true },
  blockUsers: [{ type: Schema.Types.ObjectId, index: true }],
});

module.exports = mongoose.model('BlockUsers', BlockUsersSchema);
