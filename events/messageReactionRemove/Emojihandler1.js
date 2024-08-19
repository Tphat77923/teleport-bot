
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
    if (!reaction.users.cache.has(user.id)) {
      // Remove the role
      member.roles.remove(role);
      console.log(`Removed role ${role.name} from ${user.username} for unreacting with ${reaction.emoji.name}`);
    }
  } catch (error) {
    console.error(`Error in emojiHandler: ${error}`);
  }
};