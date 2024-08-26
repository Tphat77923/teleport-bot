
const { GuildMemberRoleManager } = require('discord.js');
const ReactionRole = require('../../models/ReactionRole')

module.exports = async (client, reaction, user) => {
  if (user.bot) return;
  let emojis = `<:${reaction.emoji.name}:${reaction.emoji.id}>`
  if (!reaction.emoji.id) emojis = reaction.emoji.name
  try {
    const reactionRole = await ReactionRole.findOne({ messageId: reaction.message.id, emoji: emojis });

    if (!reactionRole) {
      console.log(`No reaction role found for message ${reaction.message.id} and emoji ${emojis}`);
      return;
    }

    const role = reaction.message.guild.roles.cache.get(reactionRole.roleId);

    if (!role) {
      console.log(`Role not found: ${reactionRole.roleId}`);
      return;
    }

    const member = await reaction.message.guild.members.fetch(user.id);
    const botMember = reaction.message.guild.members.me;
    if (!botMember.permissions.has('MANAGE_ROLES') || !botMember.permissions.has('ADMINISTRATOR')) {
      user.send(`I don't have permission to add the role ${role.name} to you. Please contact a server administrator.`);
      console.log(`Cannot add role ${role.name} to ${user.username} due to lack of permissions`);
      return;
    }

    // Check if the role is higher than the bot's highest role
    if (role.position > botMember.roles.highest.position) {
      user.send(`I don't have permission to add the role ${role.name} to you because it's higher than my highest role. Please contact a server administrator.`);
      console.log(`Cannot add role ${role.name} to ${user.username} because it's higher than my highest role`);
      return;
    }
    // Check if the user has already reacted with the emoji
    if (!reaction.users.cache.has(user.id)) {
      // Remove the role
      member.roles.remove(role);
      console.log(`Removed role ${role.name} from ${user.username} for unreacting with ${emojis}`);
    }
  } catch (error) {
    console.error(`Error in emojiHandler1: ${error}`);
  }
};