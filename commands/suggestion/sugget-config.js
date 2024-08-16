const GuildConfiguration = require('../../models/GuildConfiguration');
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'suggestion-config',
    description: 'Configure the suggestion system for this server',
    category: 'Suggestion',
    devOnly: false,
    testOnly: false,
    options: [
        {
            name: 'type',
            description: 'The type of suggestion system to use',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Add',
                    value: 'add',
                },
                {
                    name: 'Remove',
                    value: 'remove',
                },
            ],
        },
        {
            name: 'channel',
            description: 'The channel to send suggestions to',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],


    callback: async (client, interaction) => {
        const type = interaction.options.getString('type')
        const channel = interaction.options.getChannel('channel');
        let guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId })
        if (!guildConfiguration) {
            guildConfiguration = new GuildConfiguration({ guildId: interaction.guildId })
            
        }
        
        if (!channel) {
            interaction.reply({
                content: 'The channel must be a text channel.',
                ephemeral: true,
            });
            return;
        }
        const channelId = channel.id;
        if (type == "add") {
            if (guildConfiguration.suggestionsChannelIds.includes(channelId)) {
                interaction.reply({
                    content: 'This channel is already configured for suggestions.',
                    ephemeral: true,
                });
                return;
            }
            guildConfiguration.suggestionsChannelIds.push(channelId);
            await guildConfiguration.save()
        const embed = new EmbedBuilder()
            .setColor('#32a852')
            .setTitle('Suggestion System Configured')
            .setDescription(`Suggestions will now be sent to ${channel}`);
        interaction.reply({ embeds: [embed] });
    } else if(type == 'remove') {
        if (!guildConfiguration.suggestionsChannelIds.includes(channelId)) {
            interaction.reply({
                content: 'This channel is not configured for suggestions.',
                ephemeral: true,
            });
            return;
        }
        guildConfiguration.suggestionsChannelIds = guildConfiguration.suggestionsChannelIds.filter((id) => id !== channelId);
        await guildConfiguration.save()
        const embed = new EmbedBuilder()
            .setColor('#32a852')
            .setTitle('Suggestion System Configured')
            .setDescription(`Suggestions will no longer be sent to ${channel}`);
        interaction.reply({ embeds: [embed] });
    }
    },
}