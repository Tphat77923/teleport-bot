const { Schema, model } = require('mongoose');

const warnSchema = new Schema({
  userId: {
    type: String,
    required: true,
    default: 0,
  },
  warn: {
    type: Number,
    required: true,
    default: 0,
  },
  guildId: {
    type: String,
    required: true,
    default: 0,
  },
});

module.exports = model('Warn', warnSchema);