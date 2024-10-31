const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, StringSelectMenuBuilder, ChannelType, TextInputStyle, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, SelectMenuBuilder } = require('discord.js')
const Ticket = require('../../models/Tickets')

module.exports = {
    name: 'ticket',
    description: 'Set up the ticket system',
    category: '🔑Management',
    options: [
        {
            name: "add",
            description: 'create the ticket channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send the ticket in',
                    type: ApplicationCommandOptionType.Channel,
                    ChannelType: ChannelType.GuildText,
                    required: true
                },
                {
                    name: 'category',
                    description: 'The category to create the ticket in',
                    type: ApplicationCommandOptionType.Channel,
                    ChannelType: ChannelType.GuildCategory,
                    required: true
                },
                {
                    name: 'support-role',
                    description: 'The role you want to handle these ticket!',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ],

        },
        {
            name: "remove",
            description: 'remove the ticket channel',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'channel',
                    description: 'The channel to remove the ticket in',
                    type: ApplicationCommandOptionType.Channel,
                    ChannelType: ChannelType.GuildText,
                    required: true
                }
            ]
        }
    ],
    permissionsRequired: PermissionFlagsBits.Administrator,

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) => {
        if (!interaction.inGuild()) {
            interaction.reply({
              content: 'You can only use this command in a server!',
                ephemeral: true,
            });
            return;
            }
        const type = interaction.options.getSubcommand();
        const channel = interaction.options.getChannel('channel');
        if (!channel || channel.type !== ChannelType.GuildText) {
            interaction.reply({
                content: 'The channel must be a text channel.',
                ephemeral: true,
            });
            return;
        }
         
        if(type === 'add'){
            
            const category = interaction.options.getChannel('category');
            const role = interaction.options.getRole('support-role');
            if (!category || category.type !== ChannelType.GuildCategory) {
                interaction.reply({
                    content: 'The catergory must be a catergory channel.',
                    ephemeral: true,
                });
                return;
            }

            const query = {
                guildId: interaction.guild.id,
                channelId: channel.id,
                categoryId: category.id,
                roleId: role.id,
                ticketId: "tickettopic.emty",
                messageId: null,
                topic : null
            }
            const exist = await Ticket.findOne({ guildId: interaction.guild.id })
            if(exist){
                //await interaction.deferReply({ephemeral: true})
            if( exist.channelId.includes(channel.id)) return interaction.reply({
                content: 'This channel is already a ticket channel!',
                ephemeral: true
            })
        }
            const modal = new ModalBuilder()
                .setTitle('Ticket-Topic')
                .setCustomId('ticket-topic')
            
            const textInput1 = new TextInputBuilder()
                .setCustomId('ticket-topic-input1')
                .setLabel('What is your frist topic you will support?')
                .setPlaceholder('1')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(100);
            const textInput2 = new TextInputBuilder()
                .setCustomId('ticket-topic-input2')
                .setLabel('What is your second topic you will support?')
                .setPlaceholder('2')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setMaxLength(100);
            const textInput3 = new TextInputBuilder()
                .setCustomId('ticket-topic-input3')
                .setLabel('What is your third topic you will support?')
                .setPlaceholder('3')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setMaxLength(100);
            const textInput4 = new TextInputBuilder()
                .setCustomId('ticket-topic-input4')
                .setLabel('What is your forth topic you will support?')
                .setPlaceholder('4')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setMaxLength(100);
            const textInput5 = new TextInputBuilder()
                .setCustomId('ticket-topic-input5')
                .setLabel('What is your fifth topic you will support?')
                .setPlaceholder('5')
                .setStyle(TextInputStyle.Short)
                .setRequired(false)
                .setMaxLength(100);
        

                const actionRow1 = new ActionRowBuilder()
                    .addComponents(textInput1);

                const actionRow2 = new ActionRowBuilder()
                    .addComponents(textInput2);

                const actionRow3 = new ActionRowBuilder()
                    .addComponents(textInput3);

                const actionRow4 = new ActionRowBuilder()
                    .addComponents(textInput4);

                const actionRow5 = new ActionRowBuilder()
                    .addComponents(textInput5);

                modal.addComponents(actionRow1, actionRow2, actionRow3, actionRow4, actionRow5);
            await interaction.showModal(modal)
            const filter = (i) => i.customId === 'ticket-topic'
            const modalInteraction = await interaction.awaitModalSubmit({
                filter,
                time: 1000 * 60 * 3
              }).catch((error) => console.log(error))
              
              const topic1 = modalInteraction.fields.getTextInputValue('ticket-topic-input1');
              const topic2 = modalInteraction.fields.getTextInputValue('ticket-topic-input2');
              const topic3 = modalInteraction.fields.getTextInputValue('ticket-topic-input3');
              const topic4 = modalInteraction.fields.getTextInputValue('ticket-topic-input4');
              const topic5 = modalInteraction.fields.getTextInputValue('ticket-topic-input5');
              const topics = [topic1, topic2, topic3, topic4, topic5].filter(topic => topic !== '' && topic.trim() !== '');
            query.topic = topics.join(', ')
            await modalInteraction.deferReply({ ephemeral: true })
            const embed = new EmbedBuilder()
                .setTitle('Ticket System')
                .setDescription(`If you have a problems, Open a ticket in here to talk with staff or support members!`)
                .setColor('#a205f7')
                .setFooter({ text: `${interaction.guild.name} ticket system!` })
                .setTimestamp()

            const menu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('ticket-menu')
                        .setPlaceholder('Select the topic you want to talk about')
                        .addOptions(topics.map((topic) => {
                            return {
                              label: topic,
                              value: `tickettopic.${topic}`,
                            }
                          }))
                      )
                const msg = await channel.send({ embeds: [embed], components: [menu] }).catch((err) => {
                    console.log(err)
                    modalInteraction.followUp({content: 'Error when sending message in that channel. May I have not enough permission to do that!',
                     ephemeral: true 
                    })
                    return;
                })
                query.messageId = msg.id
            const newTicket = new Ticket(query)
            newTicket.save().catch((err) => {
                console.log(err)
                modalInteraction.followUp({content: 'Error when saving ticket information. Please try again later!',
                 ephemeral: true 
                })
                return;
            })

            
            await modalInteraction.followUp({
                content: `Ticket channel has been created in ${channel}`,
                ephemeral: true
            })

        } else if (type === 'remove') {
            const exist = await Ticket.findOne({ guildId: interaction.guild.id })
            if(!exist){
                await interaction.deferReply({ephemeral: true})
                return interaction.followUp({
                    content: 'This server has no ticket channel!',
                    ephemeral: true
                })
            }
            if(!exist.channelId.includes(channel.id)){
                await interaction.deferReply({ephemeral: true})
                return interaction.followUp({
                    content: 'This channel is not a ticket channel!',
                    ephemeral: true
                })
            }
            const msg = await interaction.guild.channels.cache.get(exist.channelId).messages.fetch(exist.messageId);
            await msg.delete();
            await Ticket.findOneAndDelete({ guildId: interaction.guild.id, channelId: channel.id })
            await interaction.deferReply({ephemeral: true})
            interaction.followUp({
                content: `Ticket channel has been removed in ${channel}`,
                ephemeral: true
            })
        }
        

    }
}