const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');
const currentDate = Date.now()
const usetime = 2 * 60 * 60 * 1000
module.exports = {
    name: 'steal',
    category: '💲Economy',
    description: 'Steal money someone',
    options: [
        {
            name: 'user',
            description: "the user you want to give enderpeal for?",
            type: ApplicationCommandOptionType.User,
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
    
        await interaction.deferReply();
    
        const userId1 = interaction.member.id;
        const userId2 = interaction.options.get('user').value;
        try{
            const query1 = {
                userId: userId1,
                guildId: interaction.guild.id,
              };
        
              let user = await User.findOne(query1);
            
                const query2 = {
                    userId: userId2,
                    guildId: interaction.guild.id,
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
                let steals = Math.random() < 0.5 ? 'steal' : 'catch';
                const lastshieldDate = user2.lastshield;
                if (lastshieldDate && currentDate - lastshieldDate < usetime) steals = "locked"
                if (steals == 'steal') {
                    const amount = Math.floor(Math.random() * (user2.balance - 1 + 1)) + 1;
                    user.balance += amount;
                    user2.balance -= amount;
                    await user.save();
                    await user2.save();
                    interaction.editReply(`You have successfully stolen ${amount}${coinemoji} from <@${userId2}>`);
                } else if(steals == 'locked') {
                const amount = Math.floor(Math.random() * (user.balance - 1 + 1)) + 1;
                user.balance -= amount;
                user2.balance += amount;
                await user.save();
                await user2.save();
                interaction.editReply(`His home has been locked, and you have been caught by the police!Given ${amount}${coinemoji} to <@${userId2}>`);
                } else {
                    const amount = Math.floor(Math.random() * (user.balance - 1 + 1)) + 1;
                    user.balance -= amount;
                    user2.balance += amount;
                    await user.save();
                    await user2.save();
                    interaction.editReply(`Opps,You been caught by the police!Given ${amount}${coinemoji} to <@${userId2}>`);
                }
        }catch(err){
            console.log(err)
        }
    }
}