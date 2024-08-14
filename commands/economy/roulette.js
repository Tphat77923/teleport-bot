const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'roulette',
    category: '💲Economy',
    description: 'Play a game of roulette!',
    options: [
        {
            name: 'bet',
            description: 'The amount you want to bet',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        },  
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

            const query = {
                userId: interaction.member.id,
                guildId: interaction.guild.id,
            };

            let user = await User.findOne(query);

            if (user) {
                const lastRouletteDate = user.lastRoulette;
                const currentDate = new Date();
                const cooldownTime = 5 * 60 * 1000; // 5 minutes in milliseconds

                if (lastRouletteDate && currentDate - lastRouletteDate < cooldownTime) {
                    interaction.editReply(
                        `You've already played roulette recently. Come back in ${Math.round((cooldownTime - (currentDate - lastRouletteDate)) / 1000)} seconds!`
                    );
                    return;
                }

                user.lastRoulette = new Date();
            } else {
                interaction.editReply('You need to register first using /daily');
            } 
            if (user.balance < interaction.options.get('bet').value) return interaction.editReply('You do not have enough balance to play this game!');
            const begAmount = interaction.options.get('bet').value;
            // Generate a random roulette amount between 1000 and 10000
            const rouletteAmount = Math.floor(Math.random() * (begAmount - 1 + 1)) + 1;
            user.balance -= begAmount;
            const win = Math.random() < 0.5;

            if (win) {
                user.balance = user.balance + rouletteAmount + begAmount;
                await user.save();

                interaction.editReply(
                    `You won and earned ${rouletteAmount}${coinemoji}.\n Your new balance is ${user.balance}${coinemoji}`
                );
            } else {
                user.balance = user.balance + (begAmount - rouletteAmount);
                await user.save();

                interaction.editReply(
                    `You lost ${rouletteAmount}${coinemoji}!\n Your new balance is ${user.balance}${coinemoji}`
                );
            }
        } catch (error) {
            console.log(`Error with /roulette: ${error}`);
        }
    },
}