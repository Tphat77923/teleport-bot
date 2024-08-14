const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'beg',
    category: '💲Economy',
    description: 'beg for some money!',
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
          const lastbegDate = user.lastbeg;
          const currentDate = new Date();
          const cooldownTime = 2 * 60 * 1000; // 2 minutes in milliseconds
  
          if (lastbegDate && currentDate - lastbegDate < cooldownTime) {
            interaction.editReply(
              `You've already begged recently. Come back in ${Math.round((cooldownTime - (currentDate - lastbegDate)) / 1000)} seconds!`
            );
            return;
          }
  
          user.lastbeg = new Date();
        } else {
            interaction.editReply('You need to register first using /daily');
        }
  
        // Generate a random beg amount between 2000 and 10000
        const begAmount = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
  
        user.balance += begAmount;
        await user.save();
  
        interaction.editReply(
          `Done!You earned ${begAmount}${coinemoji}.\n Your new balance is ${user.balance}${coinemoji}`
        );
      } catch (error) {
        console.log(`Error with /beg: ${error}`);
      }
    },
  };