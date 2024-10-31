const GuildConfiguration = require('../../models/GuildConfiguration');
const Suggestion = require('../../models/Suggestion')
const { EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const formatResults = require('../../utils/fomatResults');

module.exports = {
    name: 'suggest',
    description: 'Suggest something for this server',
    category: '💭Suggestion',
    devOnly: false,
    testOnly: false,
    permissionsRequired: [],

    /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   * @param {ChatInputCommandInteraction} param0.interaction
   * 
  */
 callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
        interaction.reply({
          content: 'You can only run this command inside a server.',
          ephemeral: true,
        });
        return;
      }
    try {
    const guildConfiguration = await GuildConfiguration.findOne({ guildId: interaction.guildId})
    if(!guildConfiguration?.suggestionsChannelIds.length){
        await interaction.reply('This server has not been configured to use this command.\n Ask an admin of the server to setup this using /suggestion-config type:add channel to set up this!')
        return;
    }
    if (!guildConfiguration.suggestionsChannelIds.includes(interaction.channelId)){
        await interaction.reply(`This channel is not configured for suggestions. Please use the configured channel like ${guildConfiguration.suggestionsChannelIds.map((id) => `<#${id}>`).join(`, `)} to suggest something.`)
        return;
    }
    const modal = new ModalBuilder()
        .setTitle(`Create a suggetion`)
        .setCustomId(`suggestion-${interaction.user.id}`)
    
    const textInput = new TextInputBuilder()
        .setCustomId('suggestion-text-input')
        .setLabel('What would you like to suggest us ?')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(1000);

    const actionRow = new ActionRowBuilder()
        .addComponents(textInput)
    
    modal.addComponents(actionRow);
    
    await interaction.showModal(modal);

    const filter = (i) => i.customId === `suggestion-${interaction.user.id}`

    const modalInteraction = await interaction.awaitModalSubmit({
        filter,
        time: 1000 * 60 * 3
    }).catch((error) => console.log(error));

    await modalInteraction.deferReply({ ephemeral: true });

    let suggestionMessage;

    try{
        suggestionMessage = await interaction.channel.send('Creating suggestion, please wait and relax 😉')

    } catch (error){
        modalInteraction.editReply('Failed to create suggestion message in this channel 😔. I may not have enough permissions to do that.');
        return;
    }

    const suggestionText = modalInteraction.fields.getTextInputValue('suggestion-text-input');

    const newSuggestion = new Suggestion({
        authorId: interaction.user.id,
        guildId: interaction.guildId,
        messageId: suggestionMessage.id,
        content: suggestionText,
    });

    await newSuggestion.save();

    modalInteraction.editReply('Suggestion created!')

    const suggestionEmbed = new EmbedBuilder()
    .setAuthor({
        name: interaction.user.username,
        icon: interaction.user.displayAvatarURL({ size: 256})
    })
    .addFields([
        {name: 'Suggestion', value: suggestionText},
        {name: 'Status', value: '🕘 Pending'},
        {name: 'Votes', value: formatResults()},
    ])
    .setColor('#a205f7');

    const upvoteButton = new ButtonBuilder()
        .setEmoji('👍')
        .setLabel('Upvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.id}.upvote`)

    const downvoteButton = new ButtonBuilder()
        .setEmoji('👎')
        .setLabel('Downvote')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`suggestion.${newSuggestion.id}.downvote`)
 
    const approveButton = new ButtonBuilder()
        .setEmoji('✔')
        .setLabel('Approve')
        .setStyle(ButtonStyle.Success)
        .setCustomId(`suggestion.${newSuggestion.id}.approve`)

    const rejectButton = new ButtonBuilder()
        .setEmoji('❌')
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`suggestion.${newSuggestion.id}.reject`)

    const fristRow = new ActionRowBuilder().addComponents(upvoteButton, downvoteButton);
    const secondRow = new ActionRowBuilder().addComponents(approveButton, rejectButton);

    suggestionMessage.edit({
        content: `${interaction.user} Suggestion created!`,
        embeds: [suggestionEmbed],
        components: [fristRow, secondRow]
    })
} catch (error) {
    console.error(error);
    await interaction.reply('An error occured while processing your suggestion. Please try again later.')
}
}

}