const { guild, EmbedBuilder } = require('discord.js')

module.exports = async (client, guild) => {
    console.log(`Guild ${guild.name} has been added to the client.`);
    const channelId = '973861163802710086'
    const channel = client.channels.cache.get(channelId)

    if (!channel) return;
    const embed = new EmbedBuilder()
        .setTitle('Guild Left')
        .setDescription(`I have left a guild called ${guild.name} with ${guild.memberCount} members!`)
        .setColor('#ff1100')
        .setTimestamp()
    channel.send({ embeds: [embed] })
    };