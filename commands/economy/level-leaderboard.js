const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
} = require('discord.js');
const Level = require('../../models/level');

module.exports = {
  name: 'level-leaderboard',
  category: 'Economy',
  description: 'Displays the top users with the highest levels.',
  options: [
    {
      name: 'top',
      description: 'The number of users to display in the leaderboard.',
      type: ApplicationCommandOptionType.Integer,
      minValue: 1,
      maxValue: 100,
    },
  ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply('You can only run this command inside a server.');
      return;
    }

    await interaction.deferReply();

    const limit = interaction.options.getInteger('top') || 10;

    const levels = await Level.find({ guildId: interaction.guild.id })
      .sort({ level: -1, xp: -1 })
      .limit(limit)
      .select('-_id userId level xp');

    if (levels.length === 0) {
      interaction.editReply('No users have levels yet.');
      return;
    }

    const leaderboard = levels.map((level, index) => {
      return `**${index + 1}.** <@${level.userId}> - Level ${level.level} (${level.xp} XP)`;
    }).join('\n');

    const embed = new EmbedBuilder()
        .setTitle('Level Leaderboard')
        .setDescription(leaderboard)
        .setColor('#cb05f7')
        .setTimestamp();

    interaction.editReply({embeds: [embed]});
  },
};