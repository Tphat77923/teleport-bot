const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'fish',
    category: `${coinemoji}Economy`,
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

        let fishAmount;
        if (rarity == '🔧junk') fishAmount = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
        if (rarity == '🐟common') fishAmount = Math.floor(Math.random() * (7 - 4 + 1)) + 4;
        if (rarity == '🐠uncommon') fishAmount = Math.floor(Math.random() * (13 - 8 + 1)) + 8;
        if (rarity == '🦑rare') fishAmount = Math.floor(Math.random() * (20 - 14 + 1)) + 14;
        if (rarity == '🐋legendary') fishAmount = Math.floor(Math.random() * (30 - 20 + 1)) + 20;

        const currentDate = new Date();
        const lastbeaconDate = user.lastbeacon;
            if (lastbeaconDate && currentDate - lastbeaconDate < 1 * 60 * 60 * 1000) fishAmount*=2 
  
        user.balance += fishAmount;
        await user.save();
  
        interaction.editReply(
          `🎣 You Cast Out Your Line And Caught A ${rarity}, and get paid for ${fishAmount}${coinemoji} `
        );
      } catch (error) {
        console.log(`Error with /beg: ${error}`);
      }
    },
  };