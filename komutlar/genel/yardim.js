const { MessageEmbed } = require('discord.js');
const path = require('path');
const config = require(path.resolve(__dirname, '../../config.json'));
const prefix = config.prefix;

module.exports = {
  name: 'yardım',
  description: 'Tüm komutları listeler.',
  category: 'genel',
  execute(message, args) {
    const { commands } = message.client;

    const categories = {
      eglence: [], // Senle bir oyun oynayalımmı???
      genel: [], // Topluluk
      kullanici: [], // kullanmayan
      moderasyon: [], // Yakışıklı Güvenlik
      ekonomi: [] // Money Money Green Green
    };

    commands.forEach(command => {
      if (categories[command.category]) {
        categories[command.category].push(command.name);
      }
    });

    if (!args.length) {
      const embed = new MessageEmbed()
        .setColor('#ff7300')
        .setTitle('Komutlar')
        .addFields(
          { name: 'Eğlence', value: categories.eglence.join(', ') || 'Komut yok' },
          { name: 'Genel', value: categories.genel.join(', ') || 'Komut yok' },
          { name: 'Kullanıcı', value: categories.kullanici.join(', ') || 'Komut yok' },
          { name: 'Moderasyon', value: categories.moderasyon.join(', ') || 'Komut yok' },
          { name: 'Ekonomi', value: categories.ekonomi.join(', ') || 'Komut yok' },
          { name: 'Tüm Komutlar', value: commands.map(command => command.name).join(', ') },
          { name: 'Detaylı Bilgi', value: `\`${prefix}yardım [komut ismi]\` komutu ile ne işe yaradığını öğrenebilirsin!` }
        )
        .setTimestamp() 
        .setFooter({ text: 'Yardım Komutu' });

      return message.channel.send({ embeds: [embed] });
    }

    const name = args[0].toLowerCase();
    const command = commands.get(name);

    if (!command) {
      return message.reply('Komut bulunamadı!');
    }

    const embed = new MessageEmbed()
      .setColor('#ff7300')
      .setTitle(`Komut: ${command.name}`)
      .addFields(
        { name: 'İsim', value: command.name, inline: true },
        { name: 'Hakkında', value: command.description || 'Açıklama yok', inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Yardım Komutu' });

    message.channel.send({ embeds: [embed] });
  },
};
