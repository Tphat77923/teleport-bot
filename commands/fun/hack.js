const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'hack',
    category: '😀fun',
    description: 'hack someone for real 😉',
    options: [
      {
        name: 'user',
        description: 'The user you want to hack',
        type: ApplicationCommandOptionType.User,
        required: false
      },
    ],
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
    callback: async (client, interaction) => {
    const user = interaction.options.getUser('user');
    if (!user) return interaction.reply('Woaaah slow down, who are we hacking? It Should be a member not role.');

    const hackingMessage = await interaction.reply(`Hacking @${user.username} now...`);

    const hackingSteps = [
      `[▝]Finding IP address`,
      `[▗] **IP ADDRESS** : 127.0.0.1:2643`,
      `[▖] Selling data to the Government...`,
      `[▘] Reporting account to discord for breaking TOS...`,
      `[▝] Finding Email Address...`,
      `[▗] **Email Address** : ${user.username}@gmail.com`,
      `[▖] Hacking Epic Games Account...`,
      `[▘] Hacking medical records...`,
      `Finished hacking @${user.username}`,
    ];

    for (let i = 0; i < hackingSteps.length; i++) {
      await hackingMessage.edit(hackingSteps[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    await interaction.channel.send('The *totally* `real` and `dangerous` hack is complete');
  },
};