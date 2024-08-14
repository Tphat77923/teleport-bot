const { Client, Interaction, ApplicationCommandOptionType ,EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'buy',
    category: '💲Economy',
    description: 'Buy some items',
    options: [
        {
            name: 'item',
            description: 'The item to buy',
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
        {
            name: 'amount',
            description: 'The amount of the item to buy',
            type: ApplicationCommandOptionType.Integer,
            required: false
        }
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
        let amount = interaction.options.getInteger('amount');
        const pshield = 110;
        const psword = 120;
        const pbeacon = 100;
        if(amount == null){
            amount = 1;
        };
        if(amount <= 0) return interaction.reply('Wow! you want to buy none or sell it?');
        if(amount >= 20) return interaction.reply('Wow! you are so rich to buy alot!');
        if(item == "shield"){
            if(user.balance < pshield * amount){
                interaction.reply("You don't have enough coins to buy this item");
                return;
            }
            user.balance -= pshield * amount;
            user.shield += amount;
            await user.save();
            interaction.reply(`You bought ${amount} <:shield:1273284960631132183> for ${pshield * amount}${coinemoji}`);
        }

        if(item == "sword"){
            if(user.balance < psword * amount){
                interaction.reply("You don't have enough coins to buy this item");
                return;
            }
            user.balance -= psword * amount;
            user.sword += amount;
            await user.save();
            interaction.reply(`You bought ${amount} <:sword:1273284405351153705> for ${psword * amount}${coinemoji}`);
        }
        if(item == "beacon"){
            if(user.balance < pbeacon * amount){
                interaction.reply("You don't have enough coins to buy this item");
                return;
            }
            user.balance -= pbeacon * amount;
            user.beacon += amount;
            await user.save();
            interaction.reply(`You bought ${amount} <:Beacon:1273276806769807402> for ${pbeacon * amount}${coinemoji}`);
        }

    }
}