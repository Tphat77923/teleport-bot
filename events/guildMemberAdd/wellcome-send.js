const WelcomeChannel = require('../../models/WelcomeChannel')
const { GuildMember } = require('discord.js')

/**
 * 
 * @param {GuildMember} guildMember 
 */
module.exports = async (client, guildMember) => {
    try {
        if (guildMember.user.bot) return;
        
        const wellcomeConfigs = await WelcomeChannel.find({
            guildId: guildMember.guild.id
        })
        if (!wellcomeConfigs.length) return;

        for (const wellcomeConfig of wellcomeConfigs) {
            const targetChannel = guildMember.guild.channels.cache.get(wellcomeConfig.channelId) || (await guildMember.guild.channels.fetch(
                wellcomeConfig.channelId
            ));

            if (!targetChannel) {
                await WelcomeChannel.findOneAndDelete({
                    guildId: guildMember.guild.id,
                    channelId: wellcomeConfig.channelId
                }).catch(() => {})
                
            }

            const customMessage = wellcomeConfig.message || 'Hey {username}👋. Wellcome to {server-name}';

            const wellcomeMessage = customMessage
                .replace('{mention-member}', `<@${guildMember.id}>`)
                .replace('{username}', guildMember.user.username)
                .replace('{server-name}', guildMember.guild.name)
                .replace('{member-count}', String(guildMember.guild.memberCount))
            
            targetChannel.send(wellcomeMessage).catch(() => {})

        }
    } catch (error) {
        console.log(`Error when send wellcome message: ${error}`)
    }
}
