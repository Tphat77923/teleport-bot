const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'coinflip',
    category: `${coinemoji}Economy`,
    description: 'Flip a coin and win big!',
    options: [
      {
        name: 'bet',
        description: 'The amount you want to bet',
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
      {
        name: 'choice',
        description: 'Choose heads or tails',
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: [
          {
            name: 'Heads',
            value: 'heads',
          },
          {
            name: 'Tails',
            value: 'tails',
          },
        ],
      },
    ],
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
  
        if (!user) {
          interaction.editReply('You need to register first using /daily');
          return;
        }
  
        if (user.balance < interaction.options.get('bet').value) {
          interaction.editReply('You do not have enough balance to play this game!');
          return;
        }
  
        let betAmount = interaction.options.get('bet').value;
        const choice = interaction.options.get('choice').value;
  
        const flip = Math.random() < 0.5 ? 'heads' : 'tails';
  
        if (choice === flip) {
        const currentDate = new Date();
          const lastbeaconDate = user.lastbeacon;
        if (lastbeaconDate && currentDate - lastbeaconDate < 3600000) betAmount*=2
          user.balance += betAmount * 2;
          await user.save();
          interaction.editReply(`Your coin is ${flip}. You won and earned ${betAmount * 2}${coinemoji}. Your new balance is ${user.balance}${coinemoji}`);
        } else {
          user.balance -= betAmount;
          await user.save();
          interaction.editReply(`Your coin is ${flip}. You lost ${betAmount}${coinemoji}! Your new balance is ${user.balance}${coinemoji}`);
        }
      } catch (error) {
        console.log(`Error with /coinflip: ${error}`);
      }
    },
  };