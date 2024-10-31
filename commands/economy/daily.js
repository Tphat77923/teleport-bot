const { Client, Interaction } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
  name: 'daily',
  category: `${coinemoji}Economy`,
  description: 'Collect your dailies!',
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
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'You have already collected your dailies today. Come back tomorrow!'
          );
          return;
        }
        
        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      // Generate a random daily amount between 10000 and 50000
      let dailyAmount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
      const currentDate = new Date();
          const lastbeaconDate = user.lastbeacon;
        if (lastbeaconDate && currentDate - lastbeaconDate < 3600000) dailyAmount*=2;
      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount}${coinemoji} was added to your balance. Your new balance is ${user.balance}${coinemoji}`
      );
    } catch (error) {
      console.log(`Error with /daily: ${error}`);
    }
  },
};