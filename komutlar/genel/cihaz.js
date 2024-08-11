const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'cihaz',
  description: 'Belirtilen kullanıcının hangi cihazda aktif olduğunu gösterir.',
  category: 'genel',
  async execute(message, args) {
    // Eğer kullanıcı belirtilmemişse, komutu kullanan kişiyi kullan (opsiyonel)
    const user = message.mentions.users.first() || message.author;

    const member = await message.guild.members.fetch(user.id);
    const presence = member.presence;
    if (!presence) {
      return message.reply('Bu kullanıcının durumu bilinmiyor.');
    }

    const clientStatus = presence.clientStatus || {};
    const devices = [];
 //Emojileri ayarlayın :D
    if (clientStatus.desktop) devices.push('<:desktop:1263398469498966109> **Masaüstü\'nde**');
    if (clientStatus.mobile) devices.push('<:mobile:1263398473022177320> **Mobil\'de**');
    if (clientStatus.web) devices.push('<:web:1263398471457832961> **Tarayıcı\'da**');

    if (devices.length === 0) {
      return message.reply('Bu kullanıcı aktif değil!');
    }

    const embed = new MessageEmbed()
      .setColor('#FF7300')
      .setTitle(`${user.tag} Kullanıcı Cihaz Bilgisi`)
      .setDescription(`${user.tag} şu anda ${devices.join(', ')} aktif.`)
      .setTimestamp()
      .setFooter({ text: 'Cihaz Bilgisi' });

    message.reply({ embeds: [embed] });
  },
};
