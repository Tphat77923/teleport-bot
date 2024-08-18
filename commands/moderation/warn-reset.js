const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  name: 'reset-warn',
  category: '👮‍♂️Moderation',
  description: 'Reset warn for a member',
    options: [
        {
        name: 'user',
        type: ApplicationCommandOptionType.User,
        description: 'The member you want to warn',
        required: true,
        },
        {
        name: 'reason',
        type: ApplicationCommandOptionType.String,
        description: 'The reason for the warning',
        required: false,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
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

    try {
      await interaction.deferReply();
      const targetUserId = interaction.options.get('user')?.value || undefined
      const reason = interaction.options.get('reason')?.value || 'No reason provided'

      const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }
    if (targetUser.id === interaction.member.id|| interaction.guild.members.me.id === targetUser.id) {
      await interaction.editReply("You can't reset warn yourself or me.");
      return;
    }
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("Well well, You wanna to see if your server owner have warned ? 🤨");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't reset warn that user because they have the same/higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't reset warn that user because they have the same/higher role than me.");
      return;
    }

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      let user = await User.findOne(query);
      if (!user) {
        user = new User(query);
      }
      if (user.warn == 0 ) return interaction.editReply('This member has no warn.');
      user.warn = 0;
      await user.save();

      interaction.editReply(
        `Reset warned ${targetUser} by ${interaction.user} for reason ${reason}`
      );
    } catch (error) {
      console.log(`Error with /warn-reset: ${error}`);
    }
  },
};