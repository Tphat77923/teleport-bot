const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'inventory',
    category: '💲Economy',
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
            guildId: interaction.guild.id,
          };
    
        let user = await User.findOne(query);

          const embed = new EmbedBuilder()
            .setColor('#32a852')
            .setTitle('Viewing Your Inventory!')
            .setDescription('Here the items you brought to help you in your journey!')
            .addFields({
                name: 'Ender Shield<:shield:1273284960631132183>: ',
                value: `${user.shield}`,
                inline: true
            }, {
                name: 'Sword<:sword:1273284405351153705>: ',
                value: `${user.sword}`,
                inline: true
            }, {
                name: 'Ender beacon<:Beacon:1273276806769807402>: ',
                value: `${user.beacon}`,
                inline: true
            });
            interaction.reply({ embeds: [embed] });
    }
}