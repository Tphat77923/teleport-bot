const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const user = require('../../models/User');

const dailyAmount = 1000;

module.exports = {
  name: 'balance',
  category: '💲Economy',
  description: 'check your balance',
  options: [
    {
      name: 'user',
      description: 'The user to check the balance of',
      type: ApplicationCommandOptionType.User,
      required: false
    },
  ],
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

    await interaction.deferReply();

    const userId1 = interaction.options.get('user')?.value || interaction.member.id;

    try {
      const query = {
        userId: userId1,
        guildId: interaction.guild.id,
      };

      const baluser = await getUserBalance(query);

      if (!baluser) {
        interaction.editReply('This user does not have a balance yet.');
        return;
      }

      const userTag = interaction.guild.members.cache.get(userId1).user.tag;
      const userAvatar = interaction.guild.members.cache.get(userId1).user.displayAvatarURL();

      const embed = createBalanceEmbed(baluser, userId1, userTag, userAvatar);
      interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.editReply('An error occurred while fetching the balance.');
    }
  }
}

/**
 * Gets the user balance from the database.
 * @param {Object} query - The database query object.
 * @returns {Promise<Object>} The user balance object.
 */
async function getUserBalance(query) {
  try {
    return await user.findOne(query);
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Creates a balance embed.
 * @param {Object} baluser - The user balance object.
 * @param {string} userId1 - The user ID.
 * @param {string} userTag - The user tag.
 * @param {string} userAvatar - The user avatar URL.
 * @returns {EmbedBuilder} The balance embed.
 */
function createBalanceEmbed(baluser, userId1, userTag, userAvatar) {
  return new EmbedBuilder()
    .setColor('#32a852')
    .setTitle('Balance')
    .setAuthor({ name: userTag, iconURL: userAvatar })
    .setDescription(`The balance of <@${userId1}> is ${baluser.balance}`);
}