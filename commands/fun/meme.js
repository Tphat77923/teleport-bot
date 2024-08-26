const { Client, Interaction, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'meme',
  category: '😀fun',
  description: 'Get a random meme!',
  options:[],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const Reds = [
        "memes",
        "me_irl",
        "dankmemes",
        "comedyheaven",
        "Animemes"
    ];
  
      const Rads = Reds[Math.floor(Math.random() * Reds.length)];
  
      const res = await fetch(`https://www.reddit.com/r/${Rads}/random/.json`,{
        headers: {
          'User-Agent': 'teleport bot (tphat779231576@gmail.com)'
        }
        
      });
  
      const json = await res.json();
  
      if (!json[0]) {
        interaction.reply('Your Life Lmfao');
        return;
      }
  
      const data = json[0].data.children[0].data;
  
      const embed = new EmbedBuilder()
        .setColor('#cb05f7')
        .setURL(`https://reddit.com${data.permalink}`)
        .setTitle(data.title)
        .setDescription(`Author : ${data.author}`)
        .setImage(data.url)
        .setFooter({text:`${data.ups || 0} 👍 | ${data.downs || 0} 👎 | ${data.num_comments || 0} 💬`})
        .setTimestamp();
  
      interaction.reply({ embeds: [embed] });
  }
}