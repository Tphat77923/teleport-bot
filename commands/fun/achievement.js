const { Client, Interaction, AttachmentBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'achievement',
  category: '😀fun',
  description: 'Get a achievement!',
  options :[
    {
      name: 'text',
      description: 'The text for the achievement',
      type: ApplicationCommandOptionType.String,
      required: true
    }
  ],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const text = interaction.options.getString('text');
    await interaction.deferReply()
    const url = `https://minecraftskinstealer.com/achievement/12/Achievement%20Get!/${text}`
    const attachment = new AttachmentBuilder(url, { name: 'achievement.jpg' });
    interaction.editReply({
        content: "Congratulations, you have a MineCraft achievement!",
        files: [attachment],
    });
  },
}; 