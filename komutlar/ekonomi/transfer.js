// commands/transfer.js
const { MessageEmbed } = require('discord.js');
const { readData, writeData } = require('../../db.js');

module.exports = {
  name: 'transfer',
  description: 'Başka bir kullanıcıya para transferi yapın.',
  category: 'ekonomi',
  async execute(message, args) {
    const senderId = message.author.id;
    const recipient = message.mentions.users.first();
    const amount = parseInt(args[1]);

    if (!recipient) {
      return message.channel.send('Lütfen bir kullanıcı etiketleyin.');
    }

    // Botlar neden para alıo engelle bea
    if (recipient.bot) {
      return message.channel.send('Botlara para transferi yapılamaz.');
    }

    if (isNaN(amount) || amount <= 0) {
      return message.channel.send('Lütfen geçerli bir miktar girin.');
    }

    const data = readData();

    if (!data[senderId] || data[senderId].balance < amount) {
      return message.channel.send('Yeterli bakiyeniz yok.');
    }

    if (!data[recipient.id]) {
      data[recipient.id] = { balance: 0 };
    }

    // Kendine para neden gonderion la
    if (recipient.id === senderId) {
      const transferEmbed = new MessageEmbed()
        .setColor('#ff7300')
        .setTitle('Para Transferi')
        .setDescription(`${amount} parayı kendinize göndermeye çalıştınız. Ama... Neden???`)
        .setTimestamp()
        .setFooter({ text: 'Ekonomi Sistemi' });
      
      return message.channel.send({ embeds: [transferEmbed] });
    }

    data[senderId].balance -= amount;
    data[recipient.id].balance += amount;

    writeData(data);

    const transferEmbed = new MessageEmbed()
      .setColor('#ff7300')
      .setTitle('Para Transferi')
      .setDescription(`**${amount}** parayı başarıyla **${recipient.username}** kullanıcısına gönderdiniz.`)
      .setTimestamp()
      .setFooter({ text: 'Ekonomi Sistemi' });

    message.channel.send({ embeds: [transferEmbed] });
  },
};
