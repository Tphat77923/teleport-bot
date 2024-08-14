const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'deposit',
    category: '💲Economy',
    description: 'Deposit your money to bank',
    options: [
      {
        name: 'amount',
        description: 'The amount you want to deposit',
        type: ApplicationCommandOptionType.Integer,
        required: true,
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
        const depositAmount = interaction.options.get('amount').value;  
        const query = {
          userId: interaction.member.id,
          guildId: interaction.guild.id,
        };
  
        let user = await User.findOne(query);
  
        if (!user) {
          interaction.editReply('You need to register first using /daily');
          return;
        }
  
        if (user.balance < depositAmount) {
          interaction.editReply('You do not have enough balance to deposit this amount!');
          return;
        }
  

  
        user.balance -= depositAmount;
        user.bank += depositAmount;
  
        await user.save();
        const embed = new EmbedBuilder()
        .setTitle('Updated balance amount')
        .setDescription(`Successfully deposited **${depositAmount}**${coinemoji} to your bank!`)
        .setColor('#32a852')
        .setTimestamp();
  
        interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error(error);
        interaction.editReply('An error occurred while processing this command.');
      }
    },
}