const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji, items } = require('../../config.json');

module.exports = {
    name: 'store',
    category: `${coinemoji}Economy`,
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
                name: `1. Ender Shield${items[0].eshield}`,
                value: `Cost: 110 ${coinemoji}\nDescription: Potect your home from stealing!`
            }, {
                name: `2. Sword${items[0].esword}`,
                value: `Cost: 120 ${coinemoji}\nDescription: Fight mobs and get more enderpearl!`
            }, {
                name: `3. Ender beacon${items[0].ebeacon}`,
                value: `cost: 100 ${coinemoji}\nDescription: Double your enderpeal you earn!`
            });
            interaction.reply({ embeds: [embed] });
    }
}