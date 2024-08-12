const GuildConfiguration = require('../../models/GuildConfiguration');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'suggestion-config',
    description: 'Configure the suggestion system for this server',
    category: '🗝Admin',
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: 'channel',
            description: 'The channel to send suggestions to',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],


    callback: async (client, interaction) => {
        const { guild, options } = interaction;
        const channel = options.getChannel('channel');
        if (!channel) {
            interaction.reply({
                content: 'The channel must be a text channel.',
                ephemeral: true,
            });
            return;
        }
        const guildId = guild.id;
        const channelId = channel.id;
        const guildConfig = await GuildConfiguration.findOneAndUpdate(
            { guildId },
            { guildId, channelId },
            { new: true, upsert: true }
        );
        const embed = new EmbedBuilder()
            .setColor('#32a852')
            .setTitle('Suggestion System Configured')
            .setDescription(`Suggestions will now be sent to ${channel}`);
        interaction.reply({ embeds: [embed] });
    },
}