const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'store',
    category: '💲Economy',
    description: 'view the store items',


    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
              content: 'You can only run this command inside a server.',
              ephemeral: true,
            });
            return;
          }

          const embed = new EmbedBuilder()
            .setColor('#32a852')
            .setTitle('Wellcome to Enderman store!')
            .setDescription('Here you can buy items to help you in your journey!')
            .addFields({
                name: '1. Ender Shield<:shield:1273284960631132183>',
                value: `Cost: 110 ${coinemoji}\nDescription: Potect your home from stealing!`
            }, {
                name: '2. Sword<:sword:1273284405351153705>',
                value: `Cost: 120 ${coinemoji}\nDescription: Fight mobs and get more enderpearl!`
            }, {
                name: '3. Ender beacon<:Beacon:1273276806769807402>',
                value: `cost: 100 ${coinemoji}\nDescription: Double your enderpeal you earn!`
            });
            interaction.reply({ embeds: [embed] });
    }
}