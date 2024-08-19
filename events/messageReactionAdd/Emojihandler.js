
const { GuildMemberRoleManager } = require('discord.js');
const ReactionRole = require('../../models/ReactionRole')

module.exports = async (client, reaction, user) => {
  if (user.bot) return;

  try {
    const reactionRole = await ReactionRole.findOne({ messageId: reaction.message.id, emoji: reaction.emoji.name });

    if (!reactionRole) {
      console.log(`No reaction role found for message ${reaction.message.id} and emoji ${reaction.emoji.name}`);
      return;
    }

    const role = reaction.message.guild.roles.cache.get(reactionRole.roleId);

    if (!role) {
      console.log(`Role not found: ${reactionRole.roleId}`);
      return;
    }

    const member = await reaction.message.guild.members.fetch(user.id);

    // Check if the user has already reacted with the emoji
    if (reaction.users.cache.has(user.id)) {
      // Add the role
      member.roles.add(role);
      console.log(`Gave role ${role.name} to ${user.username} for reacting with ${reaction.emoji.name}`);
    }
  } catch (error) {
    console.error(`Error in emojiHandler: ${error}`);
  }
};