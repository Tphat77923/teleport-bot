const { ChannelType, PermissionFlagsBits, Client, Interaction, ApplicationCommandOptionType } = require("discord.js");
const wellcomeChannel = require('../../models/WelcomeChannel')

module.exports = {
    name: 'wellcome-remove',
    description: 'Remove the wellcome message for the server',
    category: '👋Wellcome',
    options:[
        {
            name: 'channel',
            description: 'The channel where the wellcome message will be sent',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
    ],
    permissionsRequired: PermissionFlagsBits.Administrator,
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
              content: 'You can only run this command inside a server.',
              ephemeral: true,
            });
            return;
          }
        const channel = interaction.options.getChannel('channel');
        if (!channel || channel.type !== ChannelType.GuildText) {
            interaction.reply({
                content: 'The channel must be a text channel.',
                ephemeral: true,
            });
            return;
        }

        const query = {
            guildId: interaction.guildId,
            channelId: channel.id
        }

        try {
            await interaction.deferReply({ ephemeral: true })
            const channelExistsInDb = await wellcomeChannel.exists(query)
            if (!channelExistsInDb){
                return interaction.followUp('That channel is not configured for wellcome message.')
            }
            wellcomeChannel.findOneAndDelete(query).then(() => {
                interaction.followUp('Wellcome message removed.')
            }).catch((error) => {
                interaction.followUp('An error occurred while removing the wellcome message.')
                console.error("error delete wellcome-channel: ",error)
            })
        } catch (error) {
            console.log('Error in /setup-wellcome: ', error)
        }
    }
}