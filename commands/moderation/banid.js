const {Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits,} = require('discord.js');

module.exports = {
    name: 'banid',
    category: '👮‍♂️Moderation',
    description: 'Ban a user by ID.',
    options: [
      {
        name: 'user-id',
        description: 'The ID of the user to ban.',
        type: ApplicationCommandOptionType.String,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for the ban.',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  
    callback: async (client, interaction) => {
      const userId = interaction.options.getString('user-id');
      const reason1 = interaction.options.getString('reason') || 'No reason provided';
      const reason = `banned by ${interaction.user.tag} for ${reason1}`;
  
      await interaction.deferReply();
  
      try {
        const user = await client.users.fetch(userId);
        if (!user) {
          await interaction.editReply("That user doesn't exist.");
          return;
        }
  
        await interaction.guild.members.ban(user, { reason: reason });
        await interaction.editReply(`Successfully banned ${user.tag}.`);
      } catch (error) {
        console.log(error);
        await interaction.editReply("Failed to ban user.");
      }
    },
  };