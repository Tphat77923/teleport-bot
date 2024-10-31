const { Schema, model } = require('mongoose');

const dmsSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    captcha: {
        type: String,
        required: true,
    }
});

module.exports = model('dms', dmsSchema);