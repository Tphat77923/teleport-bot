const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, Guild } = require("discord.js"),
moment = require("moment");

module.exports = {
    name: "serverinfo",
    category: '⚙Misc',
    description: "Show Server Information!",


    callback: async (client, interaction) => {
      const Guild = interaction.guild;
      const Owner = Guild.ownerId;
      const Created = await Format(Guild.createdTimestamp);
      const Members = Guild.memberCount;
      const Channels = Guild.channels.cache.size;
      const Roles = Guild.roles.cache.size;
      const Emojis = Guild.emojis.cache.size;
      const BoostLevel = Guild.premiumTier;
      const VerificationLevel = Guild.verificationLevel;
      const ExplicitContentFilter = Guild.explicitContentFilter;
  
      const Embed = new EmbedBuilder()
        .setColor("#20ff03")
        .setAuthor({ name: "Server Information" })
        .setDescription(`**General**\nServer Name - ${Guild.name}\nServer ID - ${Guild.id}\nOwner - <@${Owner}>\nCreated - ${Created}\nMembers - ${Members}\nChannels - ${Channels}\nRoles - ${Roles}\nEmojis - ${Emojis}\n\n**Boost**\nBoost Level - ${BoostLevel}\n\n**Security**\nVerification Level - ${VerificationLevel}\nExplicit Content Filter - ${ExplicitContentFilter}`)
        //.setFooter({ text:`Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL })
  
      return interaction.reply({ embeds: [Embed] });
    }
  };
  
  async function Format(Stamp) {
    return `${String(moment(Stamp).format("LL")).replace(",", "")} ${moment(Stamp).format("LT")} (${moment(Stamp).fromNow()})`
  }