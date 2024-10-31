const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const User = require('../../models/Warn');

module.exports = {
  name: 'warn',
  category: '👮‍♂️Moderation',
  description: 'Warn a member',
  options: [
    {
      name: 'view',
      description: 'View the warnings of a member',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'The user to view the warnings of',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
      ]
    },
        {
      name: 'add',
      description: 'Add a warning to a member',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'The user to warn',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'reason',
          description: 'The reason for the warning',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    },
    {
      name: 'reset',
      description: 'Reset a warning from a member',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'user',
          description: 'The user to remove the warning from',
          type: ApplicationCommandOptionType.User,
          required: true,
        },
        {
          name: 'reason',
          description: 'The reason for removing the warning',
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
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
    const subcommand = interaction.options.getSubcommand();
    
    if (subcommand === 'add') {
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
      await interaction.editReply("You can't warn yourself or me.");
      return;
    }
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You can't warn that user because they're the server owner.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the cmd
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't warn that user because they have the same/higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't warn that user because they have the same/higher role than me.");
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

      user.warn += 1;
      await user.save();

      interaction.editReply(
        `Warned ${targetUser} by ${interaction.user} for reason ${reason}`
      );
    } catch (error) {
      console.log(`Error with /warn: ${error}`);
    }
  } else if (subcommand === "view") {
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
        .setTitle(`View warn for ${targetUser.user.tag}`)
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
  } else if (subcommand === "reset") {
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
      console.log(`Error with /warn reset: ${error}`);
    }
  }
  },
};