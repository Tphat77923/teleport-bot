const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { error } = require('console');
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

module.exports = {
    name: 'askai',
    category: '⚙Misc',
    description: 'Ask the AI a question',
    options: [
        {
            name: 'question',
            description: 'The question you want to ask the AI',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    callback: async (client, interaction) => {
        const prompt = interaction.options.getString('question');
        try {
            await interaction.deferReply();
            const response = await generateContentWithAI(prompt);

            const embed = new EmbedBuilder()
                .setTitle('AI Response')
                .setDescription(`${response}`)
                .setColor('#cb05f7')
                .setFooter({text:`Requested by ${interaction.user.tag}`})
                .setTimestamp();
            await interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error generating content with AI:', error);
            await interaction.followUp('Sorry, My connection is not good! Can you ask again?');
        }
    }
};

async function generateContentWithAI(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };
      const chatSession = model.startChat({
        generationConfig,
      })
    const result = await chatSession.sendMessage(prompt);
    return result.response.text();
}

async function sendErrorEmbed(interaction, description) {
    const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription(description)
        .setColor('#ff0000')
        .setFooter({text:`Requested by ${interaction.user.tag}`})
        .setTimestamp();
    await interaction.followUp({ embeds: [embed] });
}