
const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require('discord.js');
const ReactionRole = require('../../models/ReactionRole');

module.exports = {
    name: 'reaction-role',
    description: 'Configure the suggestion system for this server',
    category: '👮‍♂️Moderation',
    permissionsRequired: [PermissionFlagsBits.Administrator],
    options: [
        {
            name: 'add',
            description: 'Add a reaction roles to use',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'message-id',
                description: 'The channel to send suggestions to',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'role',
                description: 'The role to give when the reaction is added',
                type: ApplicationCommandOptionType.Role,
                required: true,
            },
            {
                name: 'emoji',
                description: 'The emoji to add to the message',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            ],
        },
        {
            name: 'remove',
            description: 'Remove a reaction role',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
              {
                name: 'message-id',
                description: 'The channel to send suggestions to',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'emoji',
                description: 'The emoji to add to the message',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            ],
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],


    callback: async (client, interaction) => {
        const messageId = interaction.options.getString('message-id');
        const role = interaction.options.getRole('role');
        const emoji = interaction.options.getString('emoji');
        const type = interaction.options.getSubcommand();

        if (type === "add") {
    if (!messageId) {
      interaction.reply({
        content: 'Please provide a message ID or let me generate one for you.',
        ephemeral: true,
      });
      return;
    }

    const message = await interaction.channel.messages.fetch(messageId);
    if (!message) {
      interaction.reply({
        content: 'Message not found.',
        ephemeral: true,
      });
      return;
    }

    const reactionRole = new ReactionRole({
      guildId: interaction.guild.id,
      emoji,
      roleId: role.id,
      messageId,
    });

    await reactionRole.save();

    message.react(emoji);

    const embed = new EmbedBuilder()
      .setColor('#32a852')
      .setTitle('Reaction Role Created')
      .setDescription(`React with ${emoji} to get the role ${role.name}`);
    interaction.reply({ embeds: [embed] });
} else if(type == "remove"){
    const reactionRole = await ReactionRole.findOne({ messageId: messageId, emoji: emoji });

    if (!reactionRole) {
      interaction.reply({
        content: 'Reaction role not found.',
        ephemeral: true,
      });
      return;
    }
    message.reactions.removeAll()
    await reactionRole.delete();
    interaction.reply({
      content: 'Reaction role removed.',
    });
}

    }
}