const {Client, Message } = require('discord.js')

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    if(message.content.includes(`<@${client.user.id}>`)) {
        message.channel.send(`Hello <@${message.member.id}>, would you like me to help you anything? Use </help:1275630483316932698> to help you!`);
    }
}