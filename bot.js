// Description: Main file for the bot
const { Client, GatewayIntentBits, IntentsBitField } = require('discord.js');
const config = require('./config.json');
require('dotenv').config();
const fs = require('fs');
const eventHandler = require('./handlers/eventHandler');
const { default: mongoose } = require('mongoose');
const { name } = require('./commands/economy/daily');
const prefix = config.prefix;
const token = process.env.TOKEN;
const dbkey = process.env.DBKEY;


// Create a new client instance
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildPresences,
    IntentsBitField.Flags.MessageContent,
  ] 
});

(async ( ) => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(dbkey);
    console.log('✔ Connected to DB.');
    
    // Read all the files in the commands folder
    eventHandler(client);
    client.login(token);
    
  } catch (error) {
    console.log(`There was an error connecting to the database or run bot: ${error}`);
  }
  
})( )

// When the client is ready
