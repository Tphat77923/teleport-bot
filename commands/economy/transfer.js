const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
    name: 'transfer',
    category: `${coinemoji}Economy`,
    description: 'Transfer money to someone',
    options: [
        {
            name: 'user',
            description: "the user you want to give enderpeal for?",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: 'amount',
            description: 'The amount of enderpeal you want to give',
            type: ApplicationCommandOptionType.Integer,
            required: true,
        }
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
    
        await interaction.deferReply();
    
        const userId1 = interaction.member.id;
        const userId2 = interaction.options.get('user').value;
        const amount = interaction.options.get('amount').value;
        try{
            const query1 = {
                userId: userId1,
              };
        
              let user = await User.findOne(query1);
            
                const query2 = {
                    userId: userId2,
                };
                let user2 = await User.findOne(query2);
                if (!user2) {
                    interaction.editReply('This user does not have a balance yet.');
                    return;
                }
                if (!user) {
                    interaction.editReply('You need to register first using /daily');
                    return;
                }
                if (user.balance < amount ) {
                    interaction.editReply('You do not have enough balance to transfer this amount!');
                    return;
                }
                user.balance -= amount;
                user2.balance += amount;
                await user.save();
                await user2.save();
                interaction.editReply(`You have successfully transferred ${amount}${coinemoji} to <@${userId2}>`);
        }catch(err){
            console.log(err)
        }
    }
}