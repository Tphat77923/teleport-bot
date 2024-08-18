const { Client, Interaction, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'avatar',
    category: '⚙Misc',
    description: 'Show a user\'s avatar!',
    options: [
      {
        name: 'user',
        description: 'The user to show the avatar of',
        type: 6, // 6 is the type for USER
        required: false
      }
    ],
    callback: async (client, interaction) => {
      const user = interaction.options.getUser('user') || interaction.user;
  
      const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 1024 });
  
      const embed = new EmbedBuilder()
        .setColor('#cb05f7')
        .setTitle(`${user.username}'s Avatar`)
        .setImage(avatarUrl)
        .setFooter({ text: `Requested by ${interaction.user.username}` })
        .setTimestamp();
  
      interaction.reply({ embeds: [embed] });
    }
  }