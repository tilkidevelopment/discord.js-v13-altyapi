const { MessageEmbed } = require('discord.js');
const { readData, writeData } = require('../../db.js');

module.exports = {
  name: 'günlük',
  description: 'Günlük ödülünüzü alın.',
  category: 'ekonomi',
  async execute(message, args) {
    const userId = message.author.id;
    const minReward = 100;
    const maxReward = 10000;
    const reward = Math.floor(Math.random() * (maxReward - minReward + 1)) + minReward; // Günlük ödül miktarını rastgele belirle (OPSİYONEL)
    const data = readData();

    const currentTime = Date.now();

    if (!data[userId]) {
      data[userId] = {
        balance: reward,
        lastDaily: currentTime
      };
    } else {
      const lastDaily = data[userId].lastDaily || 0;
      const timeDifference = currentTime - lastDaily;

      if (timeDifference < 24 * 60 * 60 * 1000) {
        const nextDaily = new Date(lastDaily + 24 * 60 * 60 * 1000);
        const timeLeft = Math.ceil((nextDaily - currentTime) / (60 * 60 * 1000));
        return message.channel.send(`Günlük ödülünüzü zaten aldınız. Yeni ödül için ${timeLeft} saat beklemeniz gerekiyor.`); // CKDVDFNMDMCWPWDÖCĞPSCMDOPVR
      }

      data[userId].balance += reward;
      data[userId].lastDaily = currentTime;
    }

    writeData(data);

    const dailyEmbed = new MessageEmbed()
      .setColor('#ff7300')
      .setTitle('Günlük Ödül')
      .setDescription(`Günlük ödülünüz olan ${reward} parayı aldınız. Yeni bakiyeniz: ${data[userId].balance} para.`) // Gelsin Paralar
      .setTimestamp(new Date(data[userId].lastDaily)) // Son ödül alma zamanını göstermek için (Opsiyonel)
      .setFooter({ text: 'Ekonomi Sistemi' });

    message.channel.send({ embeds: [dailyEmbed] });
  },
};
