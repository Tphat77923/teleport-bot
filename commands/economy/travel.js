const { Client, Interaction, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const User = require('../../models/User');
const { coinemoji } = require('../../config.json');

module.exports = {
  name: 'travel',
  category: `${coinemoji}Economy`,
  description: 'Travel to a new destination with the help of an Enderman!',
  options: [],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You must run this command on the server!")
      return;}

    await interaction.deferReply()

    const destinations = [
      {
        name: 'The Mushroom Island',
        items: [
          { name: 'Mushroom', sellPrice: 3 },
          { name: 'Dirt', sellPrice: 1 },
          { name: 'Stone', sellPrice: 2 },
          { name: 'Coal', sellPrice: 3 },
          { name: 'Iron Ore', sellPrice: 4 }
        ]
      },
      {
        name: 'The Nether Fortress',
        items: [
          { name: 'Obsidian', sellPrice: 7 },
          { name: 'Lava Bucket', sellPrice: 8 },
          { name: 'Nether Brick', sellPrice: 4 },
          { name: 'Nether Quartz', sellPrice: 5 },
          { name: 'Glowstone', sellPrice: 6 }
        ]
      },
      {
        name: 'The Jungle Temple',
        items: [
          { name: 'Jungle Wood', sellPrice: 3 },
          { name: 'Vines', sellPrice: 2 },
          { name: 'Leaves', sellPrice: 1 },
          { name: 'Dirt', sellPrice: 1 },
          { name: 'Stone', sellPrice: 2 }
        ]
      },
      // ...
    ];
      const query = {

          userId: interaction.member.id,

        };

  

        let user = await User.findOne(query);

  

        if (user) {

          const lasttravelDate = user.lasttravel;

          const currentDate = new Date();

          const cooldownTime = 1 * 60 * 60 * 1000; // 1 hours in milliseconds

  

          if (lasttravelDate && currentDate - lasttravelDate < cooldownTime) {

            interaction.editReply(

              `You've already travel recently. Come back in ${Math.round((cooldownTime - (currentDate - lasttravelDate)) / 1000)} seconds!`

            );

            return;

          }

  

          user.lasttravel = new Date();
           user.save()
        } else {
            interaction.editReply('You need to register first using /daily');
            return;
        }

  

    const destination = destinations[Math.floor(Math.random() * destinations.length)];

    const teleportationEmbed = new EmbedBuilder()
      .setColor('#cb05f7')
      .setTitle('Teleporting...')
      .setDescription('The Enderman is teleporting you to your new destination...')
      .setFooter({text:'Hold on to your seat!'})
      .setTimestamp();

    interaction.editReply({ embeds: [teleportationEmbed] });

    await new Promise(resolve => setTimeout(resolve, 2000)); // wait 2 seconds

    const arrivalEmbed = new EmbedBuilder()
      .setColor('#cb05f7')
      .setTitle(`You have arrived in ${destination.name}!`)
      .setDescription(`You can mine random items here. You will receive a random quantity of items in 30 minutes.`)
      .setFooter({text:`You are now in ${destination.name}`})
      .setTimestamp();

    interaction.followUp({ embeds: [arrivalEmbed] });

    // set a timer to mine the items in 1 hour
    setTimeout(async () => {
        // mine a random quantity of items
      const minedItems = [];
      destination.items.forEach(item => {
        const quantity = Math.floor(Math.random() * 8) + 1; // random quantity between 1 and 10
        minedItems.push({ item, quantity });
      });

      // calculate the total coins earned
      let totalCoins = minedItems.reduce((acc, { item, quantity }) => acc + item.sellPrice * quantity, 0);

      // add the coins to the user's balance
      const currentDate = new Date();
      const lastbeaconDate = user.lastbeacon;
      if (lastbeaconDate && currentDate - lastbeaconDate < 3600000) totalCoins*=2
      user.balance += totalCoins;
      await user.save();

      // create a list of items mined
      const itemsMinedList = minedItems.map((item, index) => `**${index + 1}.** ${item.item.name} (x${item.quantity}) - **${item.item.sellPrice * item.quantity}** ${coinemoji}`).join('\n');

      // send a message to the user
      const mineEmbed = new EmbedBuilder()
        .setColor('#cb05f7')
        .setTitle(`You have mined a bunch of items!`)
        .setDescription(`You earned **${totalCoins}** ${coinemoji}! Your new balance is **${userData.balance}** coins.`)
        .addFields([
          { name: 'Items Mined:', value: itemsMinedList, inline: false }
        ])
        .setFooter({text:`You are now in ${destination.name}`})
        .setTimestamp();

      interaction.followUp({ embeds: [mineEmbed] });
    }, 30*60*1000); // 30 minutes
  }
}