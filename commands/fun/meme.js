const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'meme',
  category: '😀fun',
  description: 'Get a random meme!',
  callback: async (client, interaction) => {
    const imgflipAPI = 'https://api.imgflip.com/get_memes';
    const response = await fetch(imgflipAPI);
    const memeData = await response.json();

    const randomMeme = memeData.data.memes[Math.floor(Math.random() * memeData.data.memes.length)];
      if(!randomMeme) console.log('no')
    const embed = new EmbedBuilder()
      .setTitle(randomMeme.name)
      .setImage(randomMeme.url)
      .setColor('#ff69b4')
      .setFooter({ text: `Requested by ${interaction.user.tag}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};