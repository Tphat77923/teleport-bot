const {Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js')

module.exports = {
    name: 'nuke',
    category: '👮‍♂️Moderation',
    description: 'Destroy a channel.',
    options: [
        {
            name: 'channel',
            description: 'The channel you want to lock.',
            type: ApplicationCommandOptionType.Channel,
            required: true,
        },
        {
            name: 'reason',
            description: 'The reason you want to lock the channel.',
            type: ApplicationCommandOptionType.String,
            required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageChannels],
    botPermissions: [PermissionFlagsBits.ManageChannels],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const channel = interaction.options.getChannel('channel')
        const reason = interaction.options.getString('reason') || 'No reason provided.'
        interaction.reply({ content: 'Nuking...', empheral: true})

        await channel.clone().then((newChannel) => {
            newChannel.setPosition(channel.rawPosition)
            channel.delete()
            newChannel.send({ content: `This channel has been nuked by ${interaction.user.tag} for \`${reason}\`` })
        })
    }
}