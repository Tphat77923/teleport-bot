const areCommandsDifferent = require('../../utils/areCmdsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCmds');
const getLocalCommands = require('../../utils/getLocalCommands');
const { deleteAllCommands } = require('../../config.json');
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

    for (const localCommand of localCommands) {
      const { name, description, options  } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );
      if (existingCommand) {
        if (localCommands.delete) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`❌ Deleted command "${name}".`);
          continue;
        }

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

        await applicationCommands.create({
          name,
          description,
          options,
          
        });

        console.log(`✅ Registered command "${name}".`);
      }
    }
  } catch (error) {
    console.log(`⛔ There was an error: ${error}`);
  }
};