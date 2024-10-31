const { Schema, model } = require('mongoose');

const wellcomeChannelSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    channelId: {
        type: String,
        required: true,
        unique: true,
    },
    message: {
        type: String,
        default: null,
    },
},
{
    timestamps: true,
});

module.exports = model('wellcomeChannel', wellcomeChannelSchema);