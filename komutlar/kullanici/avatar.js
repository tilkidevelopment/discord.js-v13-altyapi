const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'avatar',
  description: 'Kullanıcının avatarını gösterir.',
  category: 'kullanici',
  async execute(message, args) {
    let user;

    // Kullanıcı etiketlemesi veya ID'si kontrolü (Yakışıklı Güvenlik)
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else if (args[0]) {
      try {
        user = await message.client.users.fetch(args[0]);
      } catch (error) {
        return message.reply('Geçersiz kullanıcı ID\'si.');
      }
    } else {
      user = message.author;
    }

    // Kullanıcı avatarını doğru formatta almak (opsiyonel)
    const avatarURL = user.avatarURL({ dynamic: true, size: 2048 });

    const embed = new MessageEmbed()
      .setColor('#ff7300')
      .setTitle(`${user.username} Adlı Kullanıcının Avatarı`)
      .setImage(avatarURL)
      .setTimestamp()
      .setFooter({ text: 'Avatar Komutu' });

    message.channel.send({ embeds: [embed] });
  },
};
