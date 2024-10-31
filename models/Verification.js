const { Schema, model } = require('mongoose');

const verificationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: false,
    },
    removeRoleId: {
        type: String,
        default: null,
    },
});

module.exports = model('Verification', verificationSchema);