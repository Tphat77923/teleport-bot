const {Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js')

module.exports = {
    name: 'unlock',
    category: '👮‍♂️ Moderation',
    description: 'Unlocks a channel.',
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

        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: null,
        });

        const embed = new EmbedBuilder()
            .setTitle('Channel Unlocked🔓')
            .setDescription(`This channel has been unlocked by ${interaction.user.tag} for \`${reason}\``)
            .setColor('#ff1100')
            .setTimestamp()

        await interaction.reply({ embeds: [embed] })
    }
}