const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'sunucu-bilgi',
  description: 'Sunucu bilgilerini gösterir.',
  category: 'moderasyon',
  async execute(message, args) {
    const { guild } = message;

    if (!guild) return message.reply('Bu komutu sadece bir sunucuda kullanabilirsin.');

    const owner = await guild.fetchOwner();

    const formatDate = (date) => {
      const günler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
      const aylar = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

      const gün = günler[date.getDay()];
      const ay = aylar[date.getMonth()];
      const yıl = date.getFullYear();
      const günTarihi = date.getDate();

      return `${gün}, ${günTarihi} ${ay} ${yıl}`;
    };

    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
    const totalChannels = guild.channels.cache.size;
    const boostCount = guild.premiumSubscriptionCount;

    const serverInfoEmbed = new MessageEmbed()
      .setColor('#ff7300')
      .setTitle(guild.name)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .addFields(
        { name: 'Sunucu İsmi', value: `\`\`\`${guild.name}\`\`\``, inline: true },
        { name: 'Sunucu ID', value: `\`\`\`${guild.id}\`\`\``, inline: true },
        { name: 'Sunucu Sahibi', value: `\`\`\`${owner.user.tag} (${owner.user.id})\`\`\``, inline: true },
        { name: 'Üye Sayısı', value: `\`\`\`${guild.memberCount}\`\`\``, inline: true },
        { name: 'Ses Kanalı Sayısı', value: `\`\`\`${voiceChannels}\`\`\``, inline: true },
        { name: 'Toplam Kanal Sayısı', value: `\`\`\`${totalChannels}\`\`\``, inline: true },
        { name: 'Boost Sayısı', value: `\`\`\`${boostCount}\`\`\``, inline: true },
        { name: 'Oluşturulma Tarihi', value: `\`\`\`${formatDate(guild.createdAt)}\`\`\``, inline: true },
        { name: 'Rol Sayısı', value: `\`\`\`${guild.roles.cache.size}\`\`\``, inline: true }
      )
      .setFooter({ text: `Sunucu Bilgileri ${guild.name}`, iconURL: guild.iconURL({ dynamic: true }) });

    message.channel.send({ embeds: [serverInfoEmbed] });
  },
};
