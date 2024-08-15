const { Client, Interaction, ApplicationCommandOptionType ,EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');
const usetime = 2 * 60 * 60 * 1000
const pmin = 1 * 60 * 1000

module.exports = {
    name: 'use-item',
    category: '💲Economy',
    description: 'Use the items',
    options: [
        {
            name: 'item',
            description: 'The item to use',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Ender Shield',
                    value: 'shield'
                },
                {
                    name: 'Sword',
                    value: 'sword'
                },
                {
                    name: 'Ender Beacon',
                    value: 'beacon'
                }
            ]
        },
    ],


    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
              content: 'You can only run this command inside a server.',
              ephemeral: true,
            });
            return;
        }
        const query = {
            userId: interaction.member.id,
            guildId: interaction.guild.id,
          };
    
        let user = await User.findOne(query);
        const item = interaction.options.getString('item');
        const currentDate = new Date();

        if(item == "shield"){
            if(user.shield < 1){
                interaction.reply("You don't have any shield to use .-.");
                return;
            }
            const lastshieldDate = user.lastshield;
            if (lastshieldDate && currentDate - lastshieldDate < usetime) return interaction.reply(`Your shield is in use. Disabled in ${Math.round((usetime - (currentDate - lastshieldDate)) /60 / 1000)} minutes`)
            user.shield -= 1;
            user.lastshield = Date.now()
            await user.save();
            interaction.reply(`You used <:shield:1273284960631132183> for 2 hours protection!`);
        }

        if(item == "sword"){
            if(user.balance < 1){
                interaction.reply("You don't have any sword to use .-.");
                return;
            }
            const lastswordDate = user.lastsword;
            if (lastswordDate && currentDate - lastswordDate < usetime) return interaction.reply(`Your sword is in use. Disabled in ${Math.round((usetime - (currentDate - lastswordDate)) /60 / 1000)} minutes`)
            user.sword -= 1;
            user.lastsword = Date.now()
            await user.save();
            interaction.reply(`You used <:sword:1273284405351153705> for 2 hours auto farming`);
            let totalEnderpeals = 0;
            let intervalId = setInterval(async () => {
                const mobsKilled = Math.floor(Math.random() * (10 - 3 + 1)) + 3; // 3 to 10 mobs per minute
                const enderpealsPerMob = Math.floor(Math.random() * (3 - 1 + 1)) + 1; // 1 to 3 enderpeals per mob
                totalEnderpeals += mobsKilled * enderpealsPerMob;
                interaction.followUp(`Autofarmed ${mobsKilled} mobs and earned ${enderpealsPerMob * mobsKilled} ${coinemoji}`);
            }, pmin ); // every minute

            setTimeout(async () => {
                clearInterval(intervalId);
                user.balance += totalEnderpeals;
                await user.save();
                interaction.followUp(`Your sword has finished autofarming! You earned a total of ${totalEnderpeals} ${coinemoji} enderpeals and they have been added to your balance.`);
            }, usetime); // 2 hours
            }
        if(item == "beacon"){
            if(user.balance < 1){
                interaction.reply("You don't have any beacon to use .-.");
                return;
            }
            const lastbeaconDate = user.lastbeacon;
            if (lastbeaconDate && currentDate - lastbeaconDate < usetime) return interaction.reply(`Your beacon is in use. Disabled in ${Math.round((usetime - (currentDate - lastbeaconDate)) /60 / 1000)} minutes`)
            
            user.beacon -= 1;
            user.lastbeacon = Date.now()
            await user.save();
            interaction.reply(`You used <:Beacon:1273276806769807402> for 2hours of ×2 enderpeal you earn`);
        }

    }
}