const { Client, Interaction, ApplicationCommandOptionType, Message, EmbedBuilder } = require('discord.js');
const { bugchannelreport } = require('../../config.json')
module.exports = {
  name: 'bugreport',
  category: '❓Help',
  description: 'Give me a bugreport on my bot!',
  devOnly: false,
  testOnly: false,
  options: [
    {
      name: 'bugreport',
      description: 'bugreport you want to mention for',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   * @param {Message} message
   */

  callback: async (client, interaction, message) => {
    const bugreport = interaction.options.get('bugreport').value;
    if (bugreport) {
      interaction.reply(`Thank you!Your bugreport has been sent to the developer!`);
      interaction.channel.createInvite({ 
        maxAge: 0,
        maxUses: 0,
        reason: `Requested By : ${interaction.user.tag} to sent bug to developer`

      }).then(InviteCode => {
        const report = new EmbedBuilder()
          .setTitle('Bug Report')
          .addFields(
            {
              name:"UserName:",
              value: interaction.user.tag,
              inline: true
          },
          {
            name:'UserID:',
            value: interaction.user.id,
            inline: true
          },
          {
            name:'GuildID:',
            value: interaction.guild.id,
            inline: true
          },
          {
            name:'Reported:',
            value: bugreport,
            inline: true
          },
          {
            name:'Userseach:',
            value: `**[Click Here](https://discordapp.com/users/${interaction.user.id}/)**`,
            inline: true
          },
          {
            name:'InviteLink:',
            value: `**[Click Here](https://discord.gg/${InviteCode.code})**`,
            inline: true
          }
        )
        .setColor('#ff0000');
        client.channels.cache.get(bugchannelreport).send({ 
          content: `Hey <@904512969809989673>,`,
          embeds: [report] 
        });
        

      })
      
      return;
    }
}
}