const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'leaderboard',
    category: '💲Economy',
    description: 'Show the leaderboard!',
    options: [
        {
            name: 'top',
            description: 'The top number of top users to show',
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
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
            await interaction.deferReply();

            const users = await User.find({ guildId: interaction.guild.id }).sort({ balance: -1 }).limit(interaction.options.get('top')?.value || 10);

            let leaderboard = '';
            for (let i = 0; i < users.length; i++) {
                const user = await client.users.fetch(users[i].userId);
                leaderboard += `${i + 1}. ${user.tag} - ${users[i].balance}${coinemoji}\n`;
            }

            interaction.editReply({
                content: `**Leaderboard**\n${leaderboard}`,
            });
        } catch (error) {
            console.log(`Error with /leaderboard: ${error}`);
        }
    },
}