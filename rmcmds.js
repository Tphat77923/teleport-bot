const { REST, Routes } = require('discord.js');

require('dotenv').config();
const token = process.env.TOKEN;
const clientId = "1206783758049480704";
const rest = new REST().setToken(token);
const guildId = "973859294695014420";

// rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

rest.put(Routes.applicationCommands(clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);