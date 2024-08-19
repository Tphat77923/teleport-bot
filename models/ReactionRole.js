const { Schema, model } = require('mongoose');

const ReactionRoleSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
});

module.exports = model('ReactionRole', ReactionRoleSchema);