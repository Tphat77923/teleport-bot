const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ms = require('ms');

module.exports = {
  name: 'unmute',
  category: '👮‍♂️Moderation',
  description: 'unmute a user.',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to timeout.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason for the timeout.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],


  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || 'No reason provided';
    const reason1 = `unmute by ${interaction.user.tag} for ${reason}`;

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.user.bot) {
      await interaction.editReply("I can't unmute a bot.");
      return;
    }


    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't unmute that user because they have the same/higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't unmute that user because they have the same/higher role than me.");
      return;
    }

    try {
        if (!targetUser.isCommunicationDisabled()) {
            await interaction.editReply('This user is not muted.');
            return;
        }
        await targetUser.timeout(null, reason1);
        await interaction.editReply(`Successfully unmuted ${targetUser.user.tag} for reason ${reason}.`);
    } catch (error) {
        console.log(error)
    }
  }
}