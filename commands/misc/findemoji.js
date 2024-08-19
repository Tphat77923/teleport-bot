const fetch = require("node-fetch");
const { MessageEmbed, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, } = require("discord.js");
const { permissionsRequired } = require("../moderation/kick");

module.exports = {
    name: 'findemoji',
    description: 'Find an emoji from a given name',
    category: '⚙Misc',
    options: [
        {
            name: 'emoji',
            description: 'The emoji you want to find',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    permissionsRequired:[PermissionFlagsBits.ManageMessages],

    callback: async (client, interaction) => {
      
          const query = interaction.options.getString('emoji').toLowerCase().trim().replace(' ', '_');
          let emojis = await fetch("https://emoji.gg/api/").then(res => res.json());
          let matches = emojis.filter(s => s.title === query || s.title.includes(query));
      
          if (!matches.length) {
            return interaction.reply({ embeds: [
              new EmbedBuilder()
                .setDescription(`| :x: No Results found for ${query}!`)
                .setColor("FF2052")
            ] });
          }
      
          let page = 0;
          let embed = new EmbedBuilder()
            .setTitle(matches[page].title)
            .setURL(`https://discordemoji.com/emoji/${matches[page].slug}`)
            .setColor("00FFFF")
            .setImage(matches[page].image)
            .setFooter({text:`Emoji ${page + 1}/${matches.length}`});
      
          const row = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId('add')
                .setLabel('Add Emoji')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId('cancel')
                .setLabel('Cancel')
                .setStyle(ButtonStyle.Danger)
            );
      
          const msg = await interaction.reply({ embeds: [embed], components: [row] });
      
          const filter = (interaction) => interaction.customId === 'prev' || interaction.customId === 'next' || interaction.customId === 'add' || interaction.customId === 'cancel';
          const collector = msg.createMessageComponentCollector({ filter, time: 120000 });
      
          collector.on('collect', async (interaction) => {
            if (interaction.customId === 'prev') {
              page--;
              if (!matches[page]) {
                page++;
              } else {
                let newEmbed = new EmbedBuilder()
                  .setTitle(`${matches[page].title}`)
                  .setURL(`https://discordemoji.com/emoji/${matches[page].slug}`)
                  .setColor("00FFFF")
                  .setImage(matches[page].image)
                  .setFooter({text:`Emoji ${page + 1}/${matches.length}`});
                await msg.edit({ embeds: [newEmbed] });
              }
            } else if (interaction.customId === 'next') {
              page++;
              if (!matches[page]) {
                page--;
              } else {
                let newEmbed = new EmbedBuilder()
                  .setTitle(matches[page].title)
                  .setURL(`https://discordemoji.com/emoji/${matches[page].slug}`)
                  .setColor("00FFFF")
                  .setImage(matches[page].image)
                  .setFooter({text:`Emoji ${page + 1}/${matches.length}`});
                await msg.edit({ embeds: [newEmbed] });
              }
            } else if (interaction.customId === 'add') {
              const res = matches[page];
              let created;
              try {
                const url = res.image;
                const name = res.title
                created = await interaction.guild.emojis.create({ attachment: url, name });
              } catch (err) {
                interaction.reply({ content: `Unable to add ${res.title}.` });
                console.log(err)
                return;
              }
              await msg.edit({ components: [] });
              interaction.reply({ content: `Successfully added ${created}!` });
            } else if (interaction.customId === 'cancel') {
              interaction.reply({ content: "Cancelled command." });
              await msg.edit({ components: [] });
              return;
            }
          });
      
          collector.on('end', () => {
            interaction.reply({ content: `${interaction.user.toString()}, You took too long.` });
            msg.edit({ components: [] });
          });
        }
    }
