const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits,} = require('discord.js');

module.exports = {
  name: 'kick',
  category: '👮‍♂️Moderation',
  description: 'Kicks a member from this server.',
  options: [
    {
      name: 'user',
      description: 'The user you want to kick.',
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: 'reason',
      description: 'The reason you want to kick.',
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],


  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
  */



  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('user')?.value || undefined;
    const kreason = interaction.options.get('reason')?.value || 'No reason';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }
    if (targetUser.id === interaction.member.id|| interaction.guild.members.me.id === targetUser.id) {
      await interaction.editReply("You can't kick yourself or me.");
      return;
    }
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You can't kick that user because they're the server owner.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't kick that user because they have the same/higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't kick that user because they have the same/higher role than me.");
      return;
    }
    const inuserId = interaction.user.id;
    const inuser = await interaction.guild.members.fetch(inuserId)
    const kickreason = `Kicked by ${inuser.user.globalName} for reason ${kreason}`
    // Kick the targetUser
    try {
      await targetUser.kick(kickreason);
      await interaction.editReply(`User ${targetUser} was kicked\nReason: ${kreason}`);
    } catch (error) {
      console.log(`There was an error when kicking: ${error}`);
      await interaction.editReply(`There was an error when kicking!`);
    }
  },

};