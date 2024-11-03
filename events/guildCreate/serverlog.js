const { guild, EmbedBuilder } = require('discord.js')

module.exports = async (client, guild) => {
    console.log(`Guild ${guild.name} has been added to the client.`);
    const channelId = '973861163802710086'
    const channel = client.channels.cache.get(channelId)

    if (!channel) return;
    const embed = new EmbedBuilder()
        .setTitle('Guild Joined')
        .setDescription(`I have joined a new guild called ${guild.name} with ${guild.memberCount} members!`)
        .setColor('#90EE90')
        .setTimestamp()
    channel.send({ embeds: [embed] })
    };