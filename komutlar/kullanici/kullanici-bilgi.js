const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kullanıcı-bilgi',
  description: 'Kullanıcı hakkında bilgi verir.',
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

    const member = message.guild.members.cache.get(user.id);

    // Kullanıcı sunucuda değilse 'member' null olcak :D
    const joinedAt = member ? member.joinedAt.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Sunucuda değil';
    const createdAt = user.createdAt.toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const roles = member ? member.roles.cache.map(role => role.name).join(', ') : 'Sunucuda değil';
    const avatarURL = user.avatarURL({ dynamic: true, size: 2048 });

    const embed = new MessageEmbed()
      .setColor('#ff7300')
      .setTitle(`${user.username} Bilgileri`)
      .setThumbnail(avatarURL)
      .addFields(
        { name: 'Kullanıcı Adı', value: `\`\`\`${user.username}\`\`\``, inline: true },
        { name: 'Tag', value: `\`\`\`#${user.discriminator}\`\`\``, inline: true },
        { name: 'ID', value: `\`\`\`${user.id}\`\`\``, inline: true },
        { name: 'Durum', value: `\`\`\`${user.presence?.status || 'Bilinmiyor'}\`\`\``, inline: true },
        { name: 'Sunucuya Katılma Tarihi', value: `\`\`\`${joinedAt}\`\`\``, inline: true },
        { name: 'Hesap Oluşturma Tarihi', value: `\`\`\`${createdAt}\`\`\``, inline: true },
        { name: 'Roller', value: `\`\`\`${roles}\`\`\``, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: 'Kullanıcı Bilgisi Komutu' });

    message.channel.send({ embeds: [embed] });
  },
};
