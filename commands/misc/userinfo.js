const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, Guild } = require("discord.js"),
moment = require("moment"); //npm i discord.js moment


module.exports = {
  name: "userinfo",
  category: '⚙Misc',
  description: "Show Member Information!",
  options: [
    {
      name: "user",
      description: "The user to get information about",
      type: ApplicationCommandOptionType.User, // USER
      required: false
    }
  ],
    /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   * @param {Guild} guild
   */

  callback: async (client, interaction) => {
    const User = interaction.options.getUser("user") || interaction.member;
      Bot = User.bot ? "Yes" : "No";
    const GuildMember = interaction.guild.members.cache.get(User.id);
    const Roles = (GuildMember.roles.cache.size - 1) == 0 ? "None" : GuildMember.roles.cache.size - 1,
      Avatar = User.avatarURL({ dynamic: true });
    const Badges = User.flags.toArray().map(F => F[0] + (F.slice(1).toLowerCase().replace(/_/g, " "))).join(", ");
    const Position = 
    User.id == interaction.guild.ownerId
        ? "Owner"
        : User.permissions.has(PermissionFlagsBits.Administrator)
        ? "Administrator"
        : User.permissions.has(PermissionFlagsBits.KickMembers)
        ? "Moderator"
        : User.permissions.has(PermissionFlagsBits.ManageMessages)
        ? "Trainee Moderator"
        : "Member";
    const Status = User.presence.status.charAt(0).toUpperCase() + User.presence.status.slice(1);
    const Created = await Format(User.createdTimestamp),
      Joined = await Format(User.joinedTimestamp);
    const Place = User.presence.clientStatus ? Object.keys(User.presence.clientStatus).map(E => E.charAt(0).toUpperCase() + E.slice(1)) : [];
    const Activity = User.presence.activities ? await Activities(User.presence.activities) : [];

    const Embed = new EmbedBuilder()
        .setColor("#20ff03")
        .setAuthor({ name: interaction.guild.ownerID == User.id ? "Owner" : "User"})
        .setDescription(`**General**\nUser - <@${User.id}>\nID - ${User.id}\nBot - ${Bot}\nPosition - ${Position}\nManageable - ${User.manageable ? "Yes" : "No"}\nRoles - ${Roles}\nCreated - ${Created}\nJoined - ${Joined}\n\n**Presence**\nStatus - ${Status}\nUsing Discord On -${Place ? Place.join("\n") == "" ? "Unknown" : Place.join("\n") : "None"}\n${Activity.length > 1 ? "Activities" : "Activity"} -\n${Activity ? Activity.join("\n") == "" ? "None" : Activity.join("\n") : "None"}\n`)
        //.setFooter({ text:`Requested by ${interaction.user.username}`, iconURL: interaction.user.avatarURL })


    return interaction.reply({ embeds: [Embed] });

    async function Activities(Arr) {
      const Types = {
        PLAYING: "Playing",
        STREAMING: "Streaming",
        LISTENING: "Listening",
        WATCHING: "Watching",
        CUSTOM_STATUS: "Custom Status",
        COMPETING: "Competing"
      };

      Arr = Arr.map(E => Types[E.type] + `: ${E.type == "CUSTOM_STATUS" ? `${E.emoji ? E.emoji.name + " " : ""}${E.state}` : E.name}`);
      return Arr;
    };

    async function Format(Stamp) {
       return `${String(moment(Stamp).format("LL")).replace(",", "")} ${moment(Stamp).format("LT")} (${moment(Stamp).fromNow()})`
    }
  }
};