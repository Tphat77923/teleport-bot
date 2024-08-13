const wiki = require("wikijs").default();
const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: "wikipedia",
    category: '⚙️Misc',
    description: "Shows Results From Wikipedia",
    options: [
        {
            name: "query",
            description: "The query to search for",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
        const query = interaction.options.getString('query');
        if (!query) return interaction.reply({ content: "**Enter A Query!**", ephemeral: true });
        let m = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#20ff03")
                    .setTitle(`Searching for ${query} in Wikipedia`)
                    .setDescription(`Searching in Wikipedia please wait for a while`)
            ],
            fetchReply: true
        });
        let result;
        const search = await wiki.search(query);
        if (!search.results.length) {
            return m.edit({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#fff703")
                        .setTitle("What was that again?")
                        .setDescription("Even Wikipedia doesn't seem to know what you're talking about.")
                        .setFooter({ text: "Check for typos or try searching for something else!" })
                ]
            });
        }
        result = await wiki.page(search.results[0]);
        try {
            let description = await result.summary();
            if (description.length > 8192) {
                const FirstEmbed = new EmbedBuilder()
                    .setAuthor({ name: result.raw.title })
                    .setColor("#20ff03")
                    .setDescription(`${description.substring(0, 1950)}...\nArticle is too long, click [**Here**](${result.raw.fullurl}) to read more!`);
                return m.edit({ embeds: [FirstEmbed] });
            } if (description.length < 2048) {
                const SecondEmbed = new EmbedBuilder()
                    .setAuthor({ name: result.raw.title })
                    .setColor("#20ff03")
                    .setDescription(`${description.slice(0, 2048)}`)
                return m.edit({ embeds: [SecondEmbed] });
            } if (description.length > 2048) {
                const ThirdEmbed = new EmbedBuilder()
                    .setAuthor({ name: result.raw.title })
                    .setColor("#20ff03")
                    .setDescription(description.slice(0, 2048))
                const FourthEmbed = new EmbedBuilder()
                    .setColor("#20ff03")
                    .setDescription(description.slice(2048, 4096))
                m.edit({ embeds: [ThirdEmbed] });
                interaction.channel.send({ embeds: [FourthEmbed] });
            } if (description.length > 4096 && description.length < 6144) {
                const FifthEmbed = new EmbedBuilder()
                    .setAuthor({ name: result.raw.title })
                    .setColor("#20ff03")
                    .setDescription(description.slice(0, 2048))
                const SixthEmbed = new EmbedBuilder()
                    .setColor("#20ff03")
                    .setDescription(description.slice(2048, 4096))
                const SeventhEmbed = new EmbedBuilder()
                    .setColor("#20ff03")
                    .setDescription(description.slice(4096, description.length))
                await m.edit({ embeds: [FifthEmbed] });
                interaction.channel.send({ embeds: [SixthEmbed] });
                interaction.channel.send({ embeds: [SeventhEmbed] });
            } if (description.length > 6144 && description.length < 8192) {
                const EightEmbed = new EmbedBuilder()
                    .setColor('#20ff03')
                    .setDescription(description.slice(0, 2048));
                const NinthEmbed = new EmbedBuilder()
                    .setColor('#20ff03')
                    .setDescription(description.slice(2048, 4096));
                const TenthEmbed = new EmbedBuilder()
                    .setColor("#20ff03")
                    .setDescription(description.slice(4096, 6144));
                const EleventhEmbed = new EmbedBuilder()
                    .setColor("#20ff03")
                    .setDescription(description.slice(6144, description.length))
                await m.edit({ embeds: [EightEmbed] });
                interaction.channel.send({ embeds: [NinthEmbed] });
                interaction.channel.send({ embeds: [TenthEmbed] });
                interaction.channel.send({ embeds: [EleventhEmbed] });
            }
        } catch (e){
            return m.edit({ embeds: [new EmbedBuilder().setDescription("Not Available!")] });
        }
    }
};