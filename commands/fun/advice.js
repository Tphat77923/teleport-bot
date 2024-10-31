const { Client, Interaction, AttachmentBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'advice',
  category: '😀fun',
  description: 'Get a random advice!',
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    await interaction.deferReply();

    const response = await fetch('https://api.adviceslip.com/advice');
    const data = await response.json();
    const advice = data.slip.advice;

    interaction.editReply(advice);
  },
}; 