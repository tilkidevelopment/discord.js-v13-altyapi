const { MessageEmbed } = require('discord.js');
const { readData, writeData } = require('../../db.js');

module.exports = {
  name: 'yazı-tura',
  description: 'Yazı tura oynayın ve yazı gelirse para kazanın',
  category: 'ekonomi',
  async execute(message, args) {
    const userId = message.author.id;
    const betAmount = parseInt(args[0]);

    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
      return message.channel.send('Lütfen geçerli bir para miktarı belirtin.');
    }

    const data = readData();

    if (!data[userId]) {
      data[userId] = { balance: 0 };
    }

    if (data[userId].balance < betAmount) {
      return message.channel.send(`Yeterli bakiyeniz yok. Mevcut bakiyeniz: ${data[userId].balance} para.`);
    }

    const resultEmbed = new MessageEmbed()
      .setColor('#ff7300')
      .setTitle('Yazı Tura')
      .setDescription('Para dönüyor...')
      .setTimestamp()
      .setFooter({ text: 'Ekonomi Sistemi' });

    const resultMessage = await message.channel.send({ embeds: [resultEmbed] });

    // 5 saniye bekletme
    await new Promise(resolve => setTimeout(resolve, 5000));

    const result = Math.random() < 0.5 ? 'yazı' : 'tura';
    let description = `Para döndü ve **${result}** geldi!`;

    if (result === 'yazı') {
      const reward = betAmount * 2;
      data[userId].balance += reward;
      description += `\nTebrikler! Yazı geldi ve ${reward} para kazandınız. Yeni bakiyeniz: ${data[userId].balance} para.`;
    } else {
      data[userId].balance -= betAmount;
      description += `\nÜzgünüm, tura geldi ve ${betAmount} para kaybettiniz. Yeni bakiyeniz: ${data[userId].balance} para.`;
    }

    writeData(data);

    resultEmbed.setDescription(description);
    resultEmbed.setTimestamp(new Date()); 
    await resultMessage.edit({ embeds: [resultEmbed] });
  },
};
