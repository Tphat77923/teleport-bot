const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const backup= require('discord-rebackup');

module.exports = {
    name: 'backup-create',
    category: '🔒Backup',
    description: 'Backup the server',

    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            });
            return;
            }
        
            await interaction.reply('Backup creating...Please wait until the backup done!');
            try {
                const backupc = await backup.create(interaction.guild);
                interaction.editReply(`Backup created with the ID: ${backupc.id}`);
                } catch (error) {
                console.error(error);
                interaction.editReply('An error occurred while creating the backup.');
                }
    }
}