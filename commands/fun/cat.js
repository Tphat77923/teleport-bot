const { Client, Interaction, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');
const { category } = require('./hack');

module.exports = {
  name: 'cat',
  category: '😀fun',
  description: 'Get a random cat image!',
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const response = await fetch('https://nekos.life/api/v2/img/meow');
    const data = await response.json();
    const url = data.url;

    const attachment = new AttachmentBuilder(url, { name: 'cat.jpg' });

    interaction.editReply({
      files: [attachment],
    });
  },
};