const {Client, Interaction, PermissionFlagsBits, InteractionType, MessageComponentInteraction, EmbedBuilder, ButtonBuilder, ChannelType, AttachmentBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, ButtonStyle, TextInputStyle} = require('discord.js');
const Ticket = require('../../models/Tickets')

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = async (client, interaction) => {
    if (interaction.isStringSelectMenu()) {
        if (!interaction.values) return;
        let choices = interaction.values
        let id = choices.join('')
        const [type, topic] = id.split('.')
        if (type !== 'tickettopic') return;

        const modal = new ModalBuilder()
            .setTitle(`${topic} ticket information.`)
            .setCustomId(`${interaction.member.id}-ticket`)

        const reason = new TextInputBuilder()
            .setPlaceholder('Type your reason about ticket.')
            .setCustomId('reason')
            .setRequired(true)
            .setLabel('The reason about your ticket.')
            .setStyle(TextInputStyle.Paragraph)
            .setMinLength(10)
            .setMaxLength(1000)

            const actionRow = new ActionRowBuilder().addComponents(reason);
            modal.addComponents(actionRow);

        try {
            const data = await Ticket.findOne({ guildId: interaction.guildId, channelId: interaction.channelId });
            if(!data) return interaction.reply('no ticket module found!');
            const filter = { guildId: interaction.guildId };
            const update = { ticketId: id };

            await Ticket.updateOne(filter, update, { new: true }).then(value => {
                interaction.showModal(modal)
            })
        } catch (err) {
            console.error(err);
        }
    } else if(interaction.isModalSubmit()){
        if (interaction.customId !== `${interaction.user.id}-ticket`) return;
        const data = await Ticket.findOne({guildId: interaction.guildId, channelId: interaction.channelId})
        if(!data) return interaction.reply('no ticket module found!')
        const [type , topic] = data.ticketId.split('.') 

        const reason = interaction.fields.getTextInputValue('reason')
        const user = interaction.user

        const posChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${user.id}`)
        if(posChannel) return await interaction.reply({ content: `You are already have a ticket open - ${posChannel}`, ephemeral:true})

            const category = data.categoryId

            const embed = new EmbedBuilder()
                .setTitle(`${interaction.user.username}'s Ticket`)
                .setDescription(`Thank you for contacting support.\n Please describe your issue and wait for support or staff respond your ticket.`)
                .addFields(
                    {
                        name: 'Topic',
                        value: topic
                    },
                    {
                    name: 'Reason',
                    value: reason
                })
                .setTimestamp()
                .setColor('#cb05f7')
                .setFooter({ text: `Ticket System` })
            
            const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(`ticket-close.${interaction.user.id}`)
                        .setLabel('Close Ticket')
                        .setStyle(ButtonStyle.Danger)
                )

            let channel = await interaction.guild.channels.create({
                name: `ticket-${interaction.user.id}`,
                parent: `${category}`,
                type: ChannelType.GuildText
            })
            
            await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                ViewChannel: false,
                SendMessages: false
            });

            await channel.permissionOverwrites.edit(interaction.user.id, {
                ViewChannel: true,
                SendMessages: true
            });

            await channel.permissionOverwrites.edit(data.roleId, {
                ViewChannel: true,
                SendMessages: true
            });

            let msg = await channel.send({
                content: `<@&${data.roleId}> will come to support you!`,
                embeds: [embed],
                components: [button]
            })

            await interaction.reply({
                content: `Your ticket is now open in ${channel}`,
                ephemeral: true,
            })

            const collector = msg.createMessageComponentCollector()

            collector.on('collect', async i => {
                if (i.customId !== `ticket-close.${interaction.user.id}` ) return;
                const acbutton = new ButtonBuilder()
                    .setCustomId(`ticket.close.${interaction.user.id}`)
                    .setLabel('Close ticket')
                    .setStyle(ButtonStyle.Danger)
                
                const confirm = new ActionRowBuilder()
                    .addComponents(acbutton)

                const confir= await i.reply({
                    content: 'Are you sure you want to close this ticket?',
                    components: [confirm],
                    ephemeral: true
                })

                const filter = i => i.customId === `ticket.close.${interaction.user.id}` && i.user.id === interaction.user.id;
                const collector2 = channel.createMessageComponentCollector({ filter, time: 30000 });

                collector2.on('collect', async b => {
                    if(b.customId !== `ticket.close.${interaction.user.id}`) return;
                    if(b.user.id !== interaction.user.id) return b.reply({ content: 'You cannot close this ticket!', ephemeral: true });
                    
                    await b.deferUpdate();
                    await confir.delete();
                    await channel.delete();
                
                    const dmembed = new EmbedBuilder()
                    .setTitle(`Your ticket has been closed`)
                    .setDescription(`Thank you for contacting us!\n If you need anything else, feel free to create another ticket.`)
                    .setTimestamp()
                    .setColor('#cb05f7')
                    .setFooter({ text: `${interaction.user.name}'s Ticket` })
                
                    await interaction.member.send({ embeds:[dmembed]})
                })
                
            })
    }
}