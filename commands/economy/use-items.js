const { Client, Interaction, ApplicationCommandOptionType ,EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji, items } = require('../../config.json');
const usetimeSword = 300000
const usetime = 3600000
const pmin = 60*1000

module.exports = {
    name: 'use-item',
    category: `${coinemoji}Economy`,
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
          };
    
        let user = await User.findOne(query);
        const item = interaction.options.getString('item');
        const currentDate = new Date();

        //shield items
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
            interaction.reply(`You used ${items[0].eshield} for 1 hours protection!`);
        }

        //sword items
        if(item == "sword"){
            if(user.sword < 1){
                interaction.reply("You don't have any sword to use .-.");
                return;
            }
            const lastswordDate = user.lastsword;
            if (lastswordDate && currentDate - lastswordDate < usetimeSword) return interaction.reply(`Your sword is in use. Disabled in ${Math.round((usetimeSword - (currentDate - lastswordDate)) /60 / 1000)} minutes`)
            user.sword -= 1;
            user.lastsword = Date.now()
            await user.save();
            interaction.reply(`You used ${items[0].esword} for 5 min auto farming`);
            let totalEnderpeals = 0;
            let intervalId = setInterval(async () => {
                const mobsKilled = Math.floor(Math.random() * (15 - 5 + 1)) + 5; // 3 to 10 mobs per minute
                const enderpealsPerMob = Math.floor(Math.random() * (3 - 1 + 1)) + 1; // 1 to 3 enderpeals per mob
                totalEnderpeals += mobsKilled * enderpealsPerMob;
            }, pmin ); // every minute

            setTimeout(async () => {
                clearInterval(intervalId);
                user.balance += totalEnderpeals;
                await user.save();
                interaction.followUp(`Your sword has finished autofarming! You earned a total of ${totalEnderpeals} ${coinemoji} enderpeals and they have been added to your balance.`);
            }, usetimeSword);
            }

        //beacon items
        if(item == "beacon"){
            if(user.beacon < 1){
                interaction.reply("You don't have any beacon to use .-.");
                return;
            }
            const lastbeaconDate = user.lastbeacon;
            if (lastbeaconDate && currentDate - lastbeaconDate < usetime) return interaction.reply(`Your beacon is in use. Disabled in ${Math.round((usetime - (currentDate - lastbeaconDate)) /60 / 1000)} minutes`)
            
            user.beacon -= 1;
            user.lastbeacon = Date.now()
            await user.save();
            interaction.reply(`You used ${items[0].ebeacon} for 1 hours of ×2 enderpeal you earn`);
        }

    }
}