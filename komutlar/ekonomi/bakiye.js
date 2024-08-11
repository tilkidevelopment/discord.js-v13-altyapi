const { MessageEmbed } = require('discord.js');
const { readData, writeData } = require('../../db.js');

module.exports = {
  name: 'bakiye',
  description: 'Bakiyenizi kontrol edin',
  category: 'ekonomi',
  async execute(message, args) {
    const userId = message.author.id;
    const data = readData();

    if (!data[userId]) {
      data[userId] = { balance: 0 };
      writeData(data);
    }
 
    const balanceEmbed = new MessageEmbed()
      .setColor('#00FF00')
      .setTitle(`${message.author.username}'nin Bakiyesi`)
      .setDescription(`Bakiyeniz: ${data[userId].balance} para`)
      .setTimestamp()
      .setFooter({ text: 'Ekonomi Sistemi' });

    message.channel.send({ embeds: [balanceEmbed] });
  },
};
