const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'fish',
    category: '💲Economy',
    description: 'fish for some money!',
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
          const lastfishDate = user.lastfish;
          const currentDate = new Date();
          const cooldownTime = 4 * 60 * 1000; // 4 minutes in milliseconds
  
          if (lastfishDate && currentDate - lastfishDate < cooldownTime) {
            interaction.editReply(
              `You've Recently Casted A Line. Come back in ${Math.round((cooldownTime - (currentDate - lastfishDate)) / 1000)} seconds!`
            );
            return;
          }
  
          user.lastfish = new Date();
        } else {
            interaction.editReply('You need to register first using /daily');
        }
        const fishID = Math.floor(Math.random() * 10) + 1;
            let rarity;
            if (fishID < 5) rarity = '🔧junk';
            else if (fishID < 8) rarity = '🐟common';
            else if (fishID < 9) rarity = '🐠uncommon';
            else if (fishID < 10) rarity = '🦑rare';
            else rarity = '🐋legendary';

        if (rarity == '🔧junk') fishAmount = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
        if (rarity == '🐟common') fishAmount = Math.floor(Math.random() * (7000 - 4000 + 1)) + 4000;
        if (rarity == '🐠uncommon') fishAmount = Math.floor(Math.random() * (13000 - 8000 + 1)) + 8000;
        if (rarity == '🦑rare') fishAmount = Math.floor(Math.random() * (20000 - 14000 + 1)) + 14000;
        if (rarity == '🐋legendary') fishAmount = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
  
        user.balance += fishAmount;
        await user.save();
  
        interaction.editReply(
          `🎣 You Cast Out Your Line And Caught A ${rarity}, and get paid for ${fishAmount} `
        );
      } catch (error) {
        console.log(`Error with /beg: ${error}`);
      }
    },
  };