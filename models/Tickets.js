const { Schema, model } = require('mongoose');

const TicketSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    ticketId:{
        type: String,
        required: true,
    },
    roleId: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
    },
    categoryId: {
        type: String,
        required: true,
    },
    topic: {
        type: String,
        required: true,
    },
});

module.exports = model('Ticket', TicketSchema);
