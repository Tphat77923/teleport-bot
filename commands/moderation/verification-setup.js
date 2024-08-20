const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ChannelType, ActionRowBuilder, ButtonStyle } = require('discord.js');
const Verification = require('../../models/Verification')


module.exports = {
  name: 'verification-setup',
  category: '👮‍♂️Moderation',
  description: 'Setup to avoid annoying bot!',
  options: [
    {
        name: 'add',
        description: 'Add a verification system to your server!',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'channel',
                description: 'The channel where the verification will be sent!',
                type: ApplicationCommandOptionType.Channel,
                required: true
            },
            {
                name: 'role',
                description: 'The role that the user will get after verification!',
                type: ApplicationCommandOptionType.Role,
                required: true
            },
            
            {
                name: 'message',
                description: 'The message that will be sent to the user!',
                type: ApplicationCommandOptionType.String,
                required: false
            },

            {
                name: 'remove-role',
                description: 'The role you want to be removed',
                type: ApplicationCommandOptionType.Role,
                required: false
            },
        ]
    },
    {
        name: 'remove',
        description: 'Remove the verification system from your server!',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'channel',
                description: 'The channel where the verification will be sent!',
                type: ApplicationCommandOptionType.Channel,
                required: true
            }
        ]
    }
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],


    /**
     * @param {Client} client
     * @param {Interaction} interaction
     * @param {Options} options
     */

    callback: async(client,interaction) => {
        const subcommand = interaction.options.getSubcommand();
        if(subcommand === 'add') {
            await interaction.deferReply()
            const channel = interaction.options.getChannel('channel');
            const role = interaction.options.getRole('role');
           const removeRole = interaction.options.getRole('remove-role') || null;
            const message = interaction.options.getString('message') || null;
            if (!channel || channel.type !== ChannelType.GuildText) {
                interaction.followUp({
                    content: 'The channel must be a text channel.',
                    ephemeral: true,
                });
                return;
            }
            const query = {
                guildId: interaction.guildId,
                channelId: channel.id,
                roleId: role.id,
                message,
                removeRoleId: removeRole ? removeRole.id : null,
            }
            const q2 = {
                guildId: interaction.guildId,
            }
            
                const channelExistsInDb = await Verification.exists(q2)
                if (channelExistsInDb){
                    return interaction.followUp('This server is already configured for verification.')
                }
                const newVerification = new Verification({
                    ...query,
                    message,
                })
                const embed = new EmbedBuilder()
                    .setTitle('Verification System')
                    .setDescription('Click the button below to verify yourself!')
                    .setColor('#a205f7')
                
                const button = new ButtonBuilder()
                    .setCustomId('subverify')
                    .setLabel('Verify')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji('✅')
                
                const actionRow = new ActionRowBuilder().addComponents(button)
                
                channel.send({
                    embeds: [embed],
                    components: [actionRow]
                })
                await newVerification.save().then(() => {
                    return interaction.followUp('Verification system has been added to your server!');
                }).catch((error) => {
                    interaction.followUp('An error occurred while saving the wellcome channel.Please try a moment later')
                    console.log("error in saving setup verification: ",error)
                    return;                
                })
          } else if(subcommand === 'remove') {
            try {
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
                await interaction.deferReply({ ephemeral: true })
                const channelExistsInDb = await Verification.exists(query)
                if (!channelExistsInDb){
                    return interaction.followUp('That channel is not configured for verify.')
                }
                Verification.findOneAndDelete(query).then(() => {
                    interaction.followUp('Verification system turned off.')
                }).catch((error) => {
                    interaction.followUp('An error occurred while removing the wellcome message.')
                    console.error("error delete verification: ",error)
                })
            } catch (error) {
                console.log('Error in /setup-verification: ', error)
            }
        }
    }
}