const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji, items } = require('../../config.json');

module.exports = {
    name: 'inventory',
    category: `${coinemoji}Economy`,
    description: 'view the your stored items',


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

          const embed = new EmbedBuilder()
            .setColor('#32a852')
            .setTitle('Viewing Your Inventory!')
            .setDescription('Here the items you brought to help you in your journey!')
            .addFields({
                name: `Ender Shield${items[0].eshield}`,
                value: `${user.shield}`,
                inline: true
            }, {
                name: `Sword${items[0].esword}`,
                value: `${user.sword}`,
                inline: true
            }, {
                name: `Ender beacon${items[0].ebeacon}`,
                value: `${user.beacon}`,
                inline: true
            });
            interaction.reply({ embeds: [embed] });
    }
}