 const { Schema, model } = require('mongoose')

const suggestionSchema = new Schema({
    authorId: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'pending',
    },
    upvotes: {
        type: [String],
        default: [],
    },
    downvotes: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});
module.exports = model('Suggestion', suggestionSchema);