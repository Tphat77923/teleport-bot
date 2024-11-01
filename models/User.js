const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
    default: 0,
  },
    lasttravel: {
    type: Date,
    required: true,
    default: 0,
  },
  bank:{
    type: Number,
    required: true,
    default: 0,
  },
  balance: {
    type: Number,
    default: 0,
  },
  shield:{
    type: Number,
    default: 0,
  },
  sword:{
    type: Number,
    default: 0,
  },
  beacon:{
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
  lastfish:{
    type: Date,
    reqired: true,
    default: 0,
  },
  lastRoulette: {
    type: Date,
    reqired: true,
    default: 0,
  },
  lastslots: {
    type: Date,
    reqired: true,
    default: 0,
  },
  lastshield:{
    type: Date,
    reqired: true,
    default: 0,
  },
  lastsword:{
    type: Date,
    reqired: true,
    default: 0,
  },
  lastbeacon:{
    type: Date,
    reqired: true,
    default: 0,
  },
});

module.exports = model('User', userSchema);