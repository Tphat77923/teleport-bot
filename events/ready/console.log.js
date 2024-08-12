const { ActivityType } = require('discord.js');

module.exports = (client) => {

let status = [
  {
    name: "for change bot feautures! /help",
    type: ActivityType.Watching,
  },
  {
    name: "for more commands! /help",
    type: ActivityType.Watching,
  },
  {
    name: "for more updates! /help",
    type: ActivityType.Watching,
  },
  {
    name: "for more suggestions! /help",
    type: ActivityType.Watching,
  }
]

    console.log(`✔ ${client.user.tag} is online.`);
    setInterval(() => {
      let random = Math.floor(Math.random() * status.length);
      client.user.setActivity(status[random]);
    }, 10000);
};