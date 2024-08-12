const {Client, Message} = require('discord.js');
const Level = require('../../models/level');
const calculateLvXp = require('../../utils/caculateLvXp');
const cooldowns = new Set();

function getRandomXp(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
    
}
/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    if (message.author.bot || cooldowns.has(message.author.id)) return;
    if (!message.inGuild()) return;

    const xpToGive = getRandomXp(15, 25);

    const query = {
        userId: message.author.id,
        guildId: message.guild.id,
    };

    try {
        const level = await Level.findOne(query);

        if (level) {
            level.xp += xpToGive;
            if (level.xp >= calculateLvXp(level.level + 1)) {
                level.xp = 0;
                level.level += 1;

                message.channel.send(`Congrats, <@${message.author.id}> have leveled up to **level ${level.level}**!`);
            }

            await level.save().catch((error) => { 
                console.log(`Error saving level: ${error}`);
                return;
            });
             cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 30000);
        } else {
            const newLevel = new Level({
                userId: message.author.id,
                guildId: message.guild.id,
                xp: xpToGive,
                level: 0,
            });
            await newLevel.save().catch((error) => {
                console.log(`Error saving new level: ${error}`);
                return;
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 300000);
        }
    } catch (error) {
        console.log(`Error giving xp: ${error}`);
    }

}