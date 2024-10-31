const { Client, Interaction, AttachmentBuilder, ApplicationCommandOptionType, EmbedBuilder} = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
    name :'jail',
    category: '😀fun',
    description:'Jail your friend!',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user you want to jail',
            required: true,
        }
    ],
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        //
        const user = interaction.options.getUser('user');
        const url = `https://api.popcat.xyz/jail?image=${user.displayAvatarURL()}`
        await interaction.deferReply();
        const response = await fetch(url);
        const buffer = await response.buffer();
        const attachment = new AttachmentBuilder(buffer, { name: 'jail.jpg' });
        const embed = new EmbedBuilder()
            .setDescription(`${user.username} is going to be jail!`)
            .setImage(`attachment://jail.jpg`);

        interaction.editReply({
            embeds: [embed],
            files: [attachment],
        });
}
}