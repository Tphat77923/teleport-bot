const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];
const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'slots',
    category: '💲Economy',
    description: 'Slot game | 9x - rare | 3x - common',
    options: [
      {
        name: 'bet',
        description: 'The amount you want to bet',
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
  
        const query = {
          userId: interaction.member.id,
          guildId: interaction.guild.id,
        };
  
        let user = await User.findOne(query);
  
        if (user){
            const lastslotsDate = user.lastslots;
          const currentDate = new Date();
          const cooldownTime = 2 * 60 * 1000; // 2 minutes in milliseconds
  
          if (lastslotsDate && currentDate - lastslotsDate < cooldownTime) {
            interaction.editReply(
              `Cooldown! Come back in ${Math.round((cooldownTime - (currentDate - lastfishDate)) / 1000)} seconds!`
            );
            return;
          }
  
          user.lastfish = new Date();
        } else {
          interaction.editReply('You need to register first using /daily');
          return;
        }

        let betAmount = interaction.options.get('bet').value;
        
        if (user.balance < betAmount) {
          interaction.editReply('You do not have enough balance to play this game!');
          return;
        }
  
      


        let win = false
        let slotResult = []
        for (let i = 0; i < 3; i++) { 
        let index = Math.floor(Math.random() * slotItems.length);
        slotResult[i] = slotItems[index];
        }

        if (slotResult[0] == slotResult[1] && slotResult[1] == slotResult[2])  { 
            betAmount *= 9
            win = true;
        } else if (slotResult[0] == slotResult[1] || slotResult[0] == slotResult[2] || slotResult[1] == slotResult[2]) { 
            betAmount *= 3
            win = true;
        }
  
        if (win == true) {
            user.balance += betAmount;
          await user.save();
          interaction.editReply(`The slots is ${slotResult[0]}|${slotResult[1]}|${slotResult[2]}.You won and earned ${betAmount}${coinemoji}.\n Your new balance is ${user.balance}${coinemoji}`);
        } else {
          user.balance -= betAmount;
          await user.save();
          interaction.editReply(`The slots is ${slotResult[0]}|${slotResult[1]}|${slotResult[2]}.You lost ${betAmount}${coinemoji}!\n Your new balance is ${user.balance}${coinemoji}`);
        }
      } catch (error) {
        console.log(`Error with /slots: ${error}`);
      }
    },
  };