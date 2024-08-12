module.exports = {
    name: 'ping',
    category: '⚙Misc',
    description: 'Replies with the bot ping!',
    usage: '/ping',
  
    callback: async (client, interaction) => {
      await interaction.deferReply();
  
      const reply = await interaction.fetchReply();
  
      const ping = reply.createdTimestamp - interaction.createdTimestamp;
  
      interaction.editReply(
        `Pong! Reply with:\n Client ping: ${ping}ms \n Websocket ping: ${client.ws.ping}ms`
      );
    },
  };