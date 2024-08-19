const {Client ,Interaction, InteractionType, MessageComponentInteraction} = require('discord.js');
const Discord = require('discord.js')
const Suggestion = require('../../models/Suggestion');
const formatResults = require('../../utils/fomatResults');

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = async (client, interaction) => {
    try {
        if (!interaction.isButton() || !interaction.customId) return;
        const [type, suggestionId, action] = interaction.customId.split('.');

        if (!type || !suggestionId || !action) return;
        if (type !== 'suggestion') return;
        await interaction.deferReply({ ephemeral: true });

        const targetSuggestion = await Suggestion.findOne({_id: suggestionId});
        const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
        const targetMessageEmbed = targetMessage.embeds[0];

        if (action === 'approve') {
            if (!interaction.memberPermissions.has('Administrator')) {
                await interaction.editReply('You do not have permissions to approve suggestion')
                return; 
            }

            targetSuggestion.status = 'approved';

            targetMessageEmbed.data.color = 0x84e660;
            targetMessageEmbed.fields[1].value = '✅Approved';

            

            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [targetMessage.components[0]],
            });
            await targetSuggestion.save()
            interaction.editReply('Suggestion approved!')
            return;
        }
        if (action === 'reject') {
            if (!interaction.memberPermissions.has('Administrator')) {
                await interaction.editReply('You do not have permissions to reject suggestion')
                return; 
            }

            targetSuggestion.status = 'rejected';

            targetMessageEmbed.data.color = 0xff6161;
            targetMessageEmbed.fields[1].value = '❌Rejected';
            
            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [targetMessage.components[0]],
            });
            await targetSuggestion.save()
            interaction.editReply('Suggestion rejected!')
            return;
        }
        if (action === 'upvote') {
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
            
            if (hasVoted) {
                await interaction.editReply('You have already voted on this suggestion');
                return;
            }
            
            targetSuggestion.upvotes.push(interaction.user.id);

            await targetSuggestion.save()
            interaction.editReply('Upvoted suggestion!')

            targetMessageEmbed.fields[2].value = formatResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });
            return;
        }
        if (action === 'downvote') {
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
            
            if (hasVoted) {
                await interaction.editReply('You have already voted on this suggestion');
                return;
            }
            
            targetSuggestion.downvotes.push(interaction.user.id);

            await targetSuggestion.save()
            interaction.editReply('Downvoted suggestion!')

            targetMessageEmbed.fields[2].value = formatResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );

            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });
            return;
        }
    } catch (error) {
        console.error('Error handlingSuggestion.js:', error);
    }

}