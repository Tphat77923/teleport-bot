const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    name: 'coinflip',
    category: 'Economy',
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
    async callback(client, interaction) {
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
  
        if (!user) {
          interaction.editReply('You need to register first using /daily');
          return;
        }
  
        if (user.balance < interaction.options.get('bet').value) {
          interaction.editReply('You do not have enough balance to play this game!');
          return;
        }
  
        const betAmount = interaction.options.get('bet').value;
        const choice = interaction.options.get('choice').value;
  
        const flip = Math.random() < 0.5 ? 'heads' : 'tails';
  
        if (choice === flip) {
          user.balance += betAmount * 2;
          await user.save();
          interaction.editReply(`You won! You earned ${betAmount * 2}. Your new balance is ${user.balance}`);
        } else {
          user.balance -= betAmount;
          await user.save();
          interaction.editReply(`You lost! You lost ${betAmount}. Your new balance is ${user.balance}`);
        }
      } catch (error) {
        console.log(`Error with /coinflip: ${error}`);
      }
    },
  };