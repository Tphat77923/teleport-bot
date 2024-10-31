const { Schema, model } = require('mongoose');

const GuildConfigurationSchema = new Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    suggestionsChannelIds: {
        type: [String],
        default: [],
    },
});

module.exports = model('GuildConfiguration', GuildConfigurationSchema);