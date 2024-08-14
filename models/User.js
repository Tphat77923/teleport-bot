const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    default: 0,
  },
  bank:{
    type: Number,
    required: true,
    default: 0,
  },
  guildId: {
    type: String,
    required: true,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  lastDaily: {
    type: Date,
    reqired: true,
    default: 0,
  },
  lastWork: {
    type: Date,
    reqired: true,
    default: 0,
  },
  lastbeg: {
    type: Date,
    reqired: true,
    default: 0,
  },
  lastRoulette: {
    type: Date,
    reqired: true,
    default: 0,
  },
});

module.exports = model('User', userSchema);