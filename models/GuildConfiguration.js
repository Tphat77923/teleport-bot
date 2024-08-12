const { Schema, model } = require('mongoose');

const GuildConfigurationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    suggestions: {
        type: [String],
        default: [],
    },
});

module.exports = model('GuildConfiguration', GuildConfigurationSchema);