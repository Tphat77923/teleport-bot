const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
  name: 'warn-count',
  category: '👮‍♂️Moderation',
  description: 'see your member has some warn ?',
    options: [
        {
        name: 'user',
        type: ApplicationCommandOptionType.User,
        description: 'The member you want to warn',
        required: true,
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

      const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }
    if (interaction.guild.members.me.id === targetUser.id) {
      await interaction.editReply("Are you want to saw my warn count 🤨");
      return;
    }
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You wanna to see if your server owner have warned ? 🤨");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition > requestUserRolePosition) {
      await interaction.editReply("You can't see warn count if thay have the higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't see warn count if thay have the higher role than me.");
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
      let warnstatus;
        if (user.warn === 0) warnstatus = '😀';
        if(user.warn <= 3 && user.warn > 0) warnstatus = `🙂`;
        if(user.warn <= 5 && user.warn > 3) warnstatus = `😐`;
        if(user.warn <= 7 && user.warn > 5) warnstatus = `😟`;
        if(user.warn <= 10 && user.warn > 7) warnstatus = `😡`;
        if(user.warn >= 10 ) warnstatus = `🤬`;
      const embed = new EmbedBuilder()
        .setTitle(`Warn count for ${targetUser.user.tag}`)
        .setDescription(`This user has ${user.warn} warn(s)`)
        .setFooter({
            text: `Warn status: ${warnstatus}`,
            iconURL: targetUser.user.displayAvatarURL({ dynamic: true }),
        })
        .setColor('#fc7a00');
        await interaction.editReply({embeds: [embed]})
    } catch (error) {
        console.error(error);
        await interaction.editReply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
}
}