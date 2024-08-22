const areCommandsDifferent = require('../../utils/areCmdsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCmds');
const getLocalCommands = require('../../utils/getLocalCommands');
const { deleteAllCommands, testServer} = require('../../config.json');
const { REST, Routes } = require('discord.js');

module.exports = async (client) => {
  try {

    require('dotenv').config();
    const token = process.env.TOKEN;
    const clientId = "1206783758049480704";
    const rest = new REST().setToken(token);
    if (deleteAllCommands === true){
    rest.put(Routes.applicationCommands(clientId), { body: [] })
	    .then(() => console.log('✅ Successfully deleted all application commands.'))
	    .catch(console.error);
    }
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client
    );

    // Delete commands that exist in the application but not in local
for (const applicationCommand of applicationCommands.cache.values()) {
  const localCommand = localCommands.find((cmd) => cmd.name === applicationCommand.name);
  if (!localCommand) {
    await applicationCommands.delete(applicationCommand.id);
    console.log(`❌ Deleted command "${applicationCommand.name}".`);
  }
}
const guildCommands = await client.guilds.cache.get(testServer).commands.fetch();
// Delete commands that exist in local but not in the guild
if(guildCommands) {
    for (const guildCommand of guildCommands.values()) {
      const localCommand = localCommands.find((cmd) => cmd.name === guildCommand.name);
      if (!localCommand) {
        await guildCommand.delete();
        console.log(`❌ Deleted guild command "${guildCommand.name}".`);
      }
    }
  }

    for (const localCommand of localCommands) {
      const { name, description, options  } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );
      if (existingCommand) {

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options
          });
          console.log(`🔧 Edited command "${name}".`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `⏩ Skipping registering command "${name}" as it's set to delete.`
          );
          continue;
        }
        if (localCommand.testOnly === true) {
          // Register command in test server
          await applicationCommands.create({
            name,
            description,
            options,
          }, testServer);
          console.log(`✅ Registered command "${name}" in test server.`);
        } else {
          // Register command globally
        await applicationCommands.create({
          name,
          description,
          options,
          
        });

        console.log(`✅ Registered command "${name}".`);
      }
    }
    }
  } catch (error) {
    console.log(`⛔ There was an error: ${error}`);
  }
};