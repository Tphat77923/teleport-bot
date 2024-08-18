const { Client, Interaction, EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const backup= require('discord-rebackup');

module.exports = {
    name: 'backup',
    category: '🔒Backup',
    description: 'Backup the server',
    options: [
        {
            name: 'type',
            description: 'The type of backup',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    name: 'Load',
                    value: 'load',
                },
                {
                    name: 'Info',
                    value: 'fetch',
                },
                {
                    name: 'Delete',
                    value: 'delete',
                }
            ],
        },
        {
            name: 'id',
            description: 'The ID of the backup',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
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
        const type = interaction.options.getString('type');
        const id = interaction.options.getString('id');
        if (type === 'load') {   
        try {
            backup.fetch(id).then( async () => {
            const continueButton = new ButtonBuilder()
                .setEmoji('👍')
                .setLabel('Continue')
                .setStyle(ButtonStyle.Danger)
                .setCustomId(`continue.bu`)

            const cancelButton = new ButtonBuilder()
                .setEmoji('👎')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`cancel.bu`)
            const fristRow = new ActionRowBuilder().addComponents(continueButton, cancelButton);
            interaction.editReply({
                content: 'All the server channels, roles, and settings will be cleared. Do you want to continue?',
                components: [fristRow]
            })
            const filter = (i) => i.customId === `continue.bu` || i.customId === `cancel.bu`
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 * 5 });
            collector.on('collect', async (i) => {
                if (i.customId === `continue.bu`) {
                    await backup.load(id, interaction.guild)
                    client.users.cache.get(interaction.user.id).send("Backup loaded sucessfully")
                } else {
                    const disabledContinueButton = new ButtonBuilder()
                    .setEmoji('👍')
                    .setLabel('Continue')
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId(`continue.bu`)
                    .setDisabled(true)

                    const disabledCancelButton = new ButtonBuilder()
                    .setEmoji('👎')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Primary)
                    .setCustomId(`cancel.bu`)
                    .setDisabled(true)

                    const disabledRow = new ActionRowBuilder().addComponents(disabledContinueButton, disabledCancelButton);
                    interaction.editReply({
                        content: 'Backup loading canceled',
                        components: [disabledRow]
                      })
                }
            })
            })
        } catch (error){
            console.error(error);
            interaction.editReply('An error occurred while loading the backup or that backup does not exsit!');
        }

        } else if(type == 'fetch') {
            try {
                const backupf = await backup.fetch(id);
                const embed = new EmbedBuilder()
                .setTitle('Backup Info')
                .setDescription(`Backup ID: ${backupf.id}\nBackup Size: ${backupf.size}MB`)
                .setColor('#a205f7')
                interaction.editReply({ embeds: [embed] })
            } catch (error) {
                console.error(error);
                interaction.editReply('An error occurred while fetching the backup or that backup does not exsit!');
            }
        } else if(type == 'delete') {
            try {
                await backup.remove(id);
                interaction.editReply('Backup deleted successfully');
            } catch (error) {
                console.error(error);
                interaction.editReply('An error occurred while deleting the backup or that backup does not exsit!');
            }
        }
    }
}