const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'work',
    category: '💲Economy',
    description: 'Go to work and earn some enderpearl!',
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
          const lastWorkDate = user.lastWork;
          const currentDate = new Date();
          const cooldownTime = 3 * 60 * 1000; // 2 minutes in milliseconds
  
          if (lastWorkDate && currentDate - lastWorkDate < cooldownTime) {
            interaction.editReply(
              `You've already worked recently. Come back in ${Math.round((cooldownTime - (currentDate - lastWorkDate)) / 1000)} seconds!`
            );
            return;
          }
  
          user.lastWork = new Date();
        } else {
            interaction.editReply('You need to register first using /daily');
        }
  
        // Generate a random work amount between 20000 and 80000
        const workAmount = Math.floor(Math.random() * (40000 - 8000 + 1)) + 8000;
  
        user.balance += workAmount;
        await user.save();
  
        interaction.editReply(
          `Done!You earned ${workAmount}${coinemoji}.\n Your new balance is ${user.balance}${coinemoji}`
        );
      } catch (error) {
        console.log(`Error with /work: ${error}`);
      }
    },
  };