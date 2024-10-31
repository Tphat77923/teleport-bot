const { Client, Interaction, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'dog',
  category: '😀fun',
  description: 'Get a random dog image!',
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const response = await fetch('https://nekos.life/api/v2/img/woof');
    const data = await response.json();
    const url = data.url;

    const attachment = new AttachmentBuilder(url, { name: 'dog.jpg' });

    interaction.editReply({
      files: [attachment],
    });
  },
};