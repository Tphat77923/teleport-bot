const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits,} = require('discord.js');
  
  module.exports = {
    name: 'ban',
    category: '👮‍♂️Moderation',
    description: 'Bans an annoying member from the server.',
    options: [
      {
        name: 'user',
        description: 'The user you want to ban.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'reason',
        description: 'Why you want to ban?',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.get('user').value;
      const reason =
        interaction.options.get('reason')?.value || 'No reason';
  
      await interaction.deferReply();
  
      const targetUser = await interaction.guild.members.fetch(targetUserId);
  
      if (!targetUser) {
        await interaction.editReply("That user doesn't exist in this server.");
        return;
      }

      if (targetUser.id === interaction.member.id|| interaction.guild.members.me.id === targetUser.id) {
        await interaction.editReply("You can't ban yourself or me.");
        return;
      }
      if (targetUser.id === interaction.guild.ownerId) {
        await interaction.editReply(
          "You can't ban that user because they're the server owner."
        );
        return;
      }
  
      const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
      const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
      const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot
  
      if (targetUserRolePosition >= requestUserRolePosition) {
        await interaction.editReply(
          "You can't ban that user because they have the same/higher role than you."
        );
        return;
      }
  
      if (targetUserRolePosition >= botRolePosition) {
        await interaction.editReply(
          "I can't ban that user because they have the same/higher role than me."
        );
        return;
      }
      const inuserId = interaction.user.id;
      const inuser = await interaction.guild.members.fetch(inuserId)
      const banreason = `Banned by ${inuser.user.globalName} for reason ${reason}`
      // Ban the targetUser
      try {
        await targetUser.ban({reason: banreason});
        await interaction.editReply(
          `User ${targetUser} was banned\nReason: ${reason}`
        );
      } catch (error) {
        console.log(`There was an error when banning: ${error}`);
        await interaction.editReply('There was an error when banning!');
      }
    },
};