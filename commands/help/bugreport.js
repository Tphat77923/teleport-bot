const { Client, Interaction, ApplicationCommandOptionType, Message, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { bugchannelreport } = require('../../config.json')

module.exports = {
  name: 'bugreport',
  category: '❓Help',
  description: 'Give me a bugreport on my bot!',
  devOnly: false,
  testOnly: false,
  options: [],

  callback: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setTitle('Create a Bug Report')
      .setCustomId(`bugreport-${interaction.user.id}`)

    const textInput = new TextInputBuilder()
      .setCustomId('bugreport-text-input')
      .setLabel('What is the bug you want to report?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true)
      .setMaxLength(1000);

    const actionRow = new ActionRowBuilder()
      .addComponents(textInput)

    modal.addComponents(actionRow);

    await interaction.showModal(modal);

    const filter = (i) => i.customId === `bugreport-${interaction.user.id}`

    const modalInteraction = await interaction.awaitModalSubmit({
      filter,
      time: 1000 * 60 * 3
    }).catch((error) => console.log(error));

    await modalInteraction.deferReply({ ephemeral: true });

    const bugreport = modalInteraction.fields.getTextInputValue('bugreport-text-input');

    modalInteraction.editReply(`Thank you! Your bugreport has been sent to the developer!`);

    interaction.channel.createInvite({ 
      maxAge: 0,
      maxUses: 0,
      reason: `Requested By : ${interaction.user.tag} to sent bug to developer`

    }).then(InviteCode => {
    const report = new EmbedBuilder()
      .setTitle('Bug Report')
      .addFields(
        {
          name: "UserName:",
          value: interaction.user.tag,
          inline: true
        },
        {
          name: 'UserID:',
          value: interaction.user.id,
          inline: true
        },
        {
          name: 'GuildID:',
          value: interaction.guild.id,
          inline: true
        },
        {
          name: 'Reported:',
          value: bugreport,
          inline: true
        },
        {
          name: 'Userseach:',
          value: `**[Click Here](https://discordapp.com/users/${interaction.user.id}/)**`,
          inline: true
        },
        {
          name: 'InviteLink:',
          value: `**[Click Here](https://discord.gg/${InviteCode.code})**`,
          inline: true
        }
      )
      .setColor('#ff0000');

    client.channels.cache.get(bugchannelreport).send({ content: `Hey <@904512969809989673>,`, embeds: [report] });
    }).catch(error => console.error(error));
  }
}