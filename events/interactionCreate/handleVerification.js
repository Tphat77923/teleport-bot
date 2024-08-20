const {Client ,Interaction, InteractionType, MessageComponentInteraction, EmbedBuilder, ButtonBuilder, AttachmentBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, Component, ButtonStyle, TextInputStyle} = require('discord.js');
const Verification = require('../../models/Verification');
const { CaptchaGenerator } = require('captcha-canvas')
const dms = require('../../models/dms')
function generateRandomString(length) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */

module.exports = async (client, interaction) => {
    try {
        
        if (interaction.isButton() && interaction.customId === 'subverify') {
        await interaction.deferReply({ ephemeral: true });
        const exists = await Verification.findOne({ guildId: interaction.guildId });
        if (!exists) return interaction.editReply('No verification system found in this server!');
        const member = interaction.member;
        guild = interaction.guild;
        const channel = guild.channels.cache.get(exists.channelId);
        const role = guild.roles.cache.get(exists.roleId);
        const removeRole = guild.roles.cache.get(exists.removeRoleId);
        if (!channel || !role) return interaction.editReply('Invalid verification system!Please contact admin to slove the problems');
        if (member.roles.cache.has(role.id)) return interaction.editReply('You are already verified!');
        if (removeRole && !member.roles.cache.has(removeRole.id)) return interaction.editReply('You are already verified!');
        
        const dm = await member.createDM();
        const message = exists.message || "Hey, you are request me a verifiaction dms! Please complete the captcha below to be verified (press sumbit button to send captcha)!"
        const value = generateRandomString(6)
        const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: value, size: 40, color: '#8803fc' })

        const buffer = await captcha.generate().catch((err) => {
            console.error(err);
        })
        const attachment = new AttachmentBuilder(buffer, { name: 'captcha.png'})
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Primary)
            .setLabel('Submit')
            .setCustomId('capButton')
            .setEmoji('✅')
        
        const embed = new EmbedBuilder()
            .setTitle('Verification System')
            .setDescription(message)
            .setColor('#a205f7')
            .setFooter({text: 'Use the button below to verify yourself'})
            .setImage('attachment://captcha.png')
        
        const capModal = new ModalBuilder()
        .setTitle('Sumbit Captacha')
        .setCustomId('capModalverify')


        const answer = new TextInputBuilder()
        .setPlaceholder('Enter the captcha here')
        .setCustomId('answer')
        .setRequired(true)
        .setStyle(TextInputStyle.Short)
        .setMinLength(6)
        .setMaxLength(6)
        .setLabel('Captcha Answer');


        const  FristButton = new ActionRowBuilder().addComponents(button)
        const  FristActionRow = new ActionRowBuilder().addComponents(answer)
        capModal.addComponents(FristActionRow);
        
        const msg = await member.send({embeds: [embed], files: [attachment], components: [FristButton]}).catch((error) => {
            console.error(error);
            interaction.followUp('Your Dms was off or i cannot dm you.')
        });
        interaction.followUp('A Dms was sent for you to reply!')
        const collector = msg.createMessageComponentCollector()
        collector.on('collect', async i => {
            if(i.customId === "capButton"){
                //await i.deferReply({ ephemeral: true });    //<--- (here)
                const query = {
                    userId: member.id,
                    guildId: guild.id,
                    captcha: value
                }
                const result = await dms.findOne({userId: member.id})
                if(!result) {
                    const newDms = new dms(query)
                await newDms.save().catch((error) => {
                    console.error(error);
                    i.followUp('(2)An error occurred while saving the information. Please try again later!')
                    return;})
                    i.showModal(capModal)
                    return;
                }
                result.captcha = value
                    await result.save().catch((error) => {
                        console.error(error);
                        i.followUp('(1)An error occurred while saving the information. Please try again later!')
                        return;
                    })
                    
                    i.showModal(capModal)
                    return;
                
                
                
            }
        })
        

    } else if(interaction.isModalSubmit() && interaction.customId === 'capModalverify') {
        const answer = interaction.fields.getTextInputValue('answer');
        await interaction.deferReply()
        const query = {
            userId: interaction.user.id        
        }
        const exists1 = await dms.findOne(query)
        if(!exists1) return interaction.followUp('(1)Invalid captcha! Please try click verify button on that server again!')
        const q2 = {
            guildId: exists1.guildId
        }
        const exists = await Verification.findOne(q2)
        if(!exists) return interaction.followUp('(2)Invalid captcha! Please try click verify button on that server again!')
        
        const roleId = exists.roleId
        const guild = client.guilds.cache.get(exists1.guildId)
        const member = guild.members.cache.get(interaction.user.id)
        const role = guild.roles.cache.get(roleId);
        if(!role) return interaction.followUp('Invalid verification system! Please contact admin to slove the problems');
        if(answer.toLowerCase() !== exists1.captcha) return interaction.followUp('Invalid captcha! Please try again!')
        member.roles.add(role).then(() => {
            interaction.followUp('You have been verified!')
        }).catch((error) => {
            console.error(error);
            interaction.followUp('An error occurred while verifying you. Please try again later!')
        })
        await exists1.deleteOne().catch((error) => {
            console.error(error);
            interaction.followUp('An error occurred while deleting the information. Please try again later!')

        })
    }
    } catch (error) {
        console.error(error);
        
    }
}