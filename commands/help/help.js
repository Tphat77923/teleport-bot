const getLocalCommands = require('../../utils/getLocalCommands');
const { Client, Interaction, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  category: '❓Help',
  description: 'Give you a help',
  options: [
    {
      name: 'command',
      description: 'The command you want to see help for',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const localCommands = getLocalCommands();
    const cmdName = interaction.options.get('command');
    if (cmdName) {
      const commandName = cmdName.value.toLowerCase();
      const command = localCommands.find((cmd) => cmd.name.toLowerCase() === commandName);
      if (!command) {
        await interaction.reply(`Command "${commandName}" not found.`);
        return;
      }
      await interaction.reply(`**${command.name}**\n${command.description}\n${command.usage}`);
      return;
    }
  
    // If no command is specified, show all commands sorted by category
    const categories = {};
    localCommands.forEach((command) => {
      if (!categories[command.category]) {
        categories[command.category] = [];
      }
      categories[command.category].push(`**${command.name}**`);
    });
  
    const helpMessage = Object.keys(categories).map((category) => {
      return `**${category}**\n╰>${categories[category].join(', ')}`;
    }).join('\n\n');
  
    const helpmessage = new EmbedBuilder()
      .setColor('#32a852')
      .setTitle('Teleport Bot Command list')
      .setDescription(helpMessage)
      .addFields({ name: 'Need more help?', value: '**[Support Server](https://tphat77923.github.io/teleport/endercity.html) - [Invite me](https://tphat77923.github.io/teleport/invite.html)**', inline: true })
      .setFooter({text:'Have a nice day!', iconURL: 'https://i.imgur.com/Dqz0j0F.png'});
    await interaction.reply({ embeds: [helpmessage] });
  },
};
