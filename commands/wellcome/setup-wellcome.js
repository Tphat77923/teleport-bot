const { ChannelType, PermissionFlagsBits, Client, Interaction, ApplicationCommandOptionType } = require("discord.js");
const wellcomeChannel = require('../../models/WelcomeChannel')

module.exports = {
    name: 'wellcome-setup',
    description: 'Setup the wellcome message for the server',
    category: '👋Wellcome',
    options:[
        {
            name: 'add',
            description: 'Add a wellcome message to a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options:[
                {
                    name: 'channel',
                    description: 'The channel to send the wellcome message',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                },
                {
                    name: 'message',
                    description: 'The message to send',
                    type: ApplicationCommandOptionType.String,
                    required: true
                }
            ]
        }, {
            name: 'remove',
            description: 'Remove the wellcome message from a channel',
            type: ApplicationCommandOptionType.Subcommand,
            options:[
                {
                    name: 'channel',
                    description: 'The channel to remove the wellcome message',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                }
            ]
        }
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
        const type = interaction.options.getSubcommand();

        if (type === "add") {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

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
                await interaction.deferReply({ emphemeral: true});
                const channelExistsInDb = await wellcomeChannel.exists(query)
                if (channelExistsInDb){
                    return interaction.followUp('That channel is already configured for wellcome message.')
                }
                const newWellcomeChannel = new wellcomeChannel({
                    ...query,
                    message,
                })
                await newWellcomeChannel.save().then(() => {
                    return interaction.followUp(`Wellcome message has been saved successfully in ${channel}`)
                }).catch((error) => {
                    interaction.followUp('An error occurred while saving the wellcome channel.Please try a moment later')
                    console.log("error in saving setup-wellcome: ",error)
                    return;                
                })
        } catch (error) {
            console.log('Error in /setup-wellcome: ', error)
        }
    } else if (type === 'remove') {
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
}