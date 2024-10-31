const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const ms = require('ms');


module.exports = {
    name: 'timer',
    category: '⚙Misc',
    description: 'Set a timer',
    options: [
        {
            name: 'time',
            description: 'The time for the timer(1s, 1m, 1h, 1d)',
            type: ApplicationCommandOptionType.String,
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the timer',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        await interaction.deferReply();
        const time = interaction.options.get('time').value;
        const reason = interaction.options.get('reason')?.value || 'No reason provided';
        const timeRegex = /^(?:\d+(?:s|m|h|d))$/;
        if (!timeRegex.test(time)) {
          await interaction.editReply('Invalid time format. Please use 1s, 1m, 1h, or 1d.');
          return;
        }
    
        const timeInMs = ms(time);
        if (timeInMs > ms('5m')) {
          await interaction.editReply('Timer cannot be set for more than 5 minutes.');
          return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Timer')
            .setDescription(`Timer set for ${time}`)
            .addFields({
                name: 'Reason',
                value: reason
            })
            .setColor('#20ff03')
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });

        setTimeout(() => {
            interaction.editReply(`Hey <@${interaction.user.id}>, your timer is done!`);
        }, timeInMs);
    }
}