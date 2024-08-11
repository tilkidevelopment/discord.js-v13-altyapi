const axios = require('axios');
const cheerio = require('cheerio');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'deprem',
  description: 'Son depremleri gösterir.',
  category: 'kullanici',
  async execute(message, args) {
    try {
      class Deprem {
        constructor(tarih, saat, enlem, boylam, derinlik, buyukluk, yer, sehir) {
          this.tarih = tarih;
          this.saat = saat;
          this.enlem = enlem;
          this.boylam = boylam;
          this.derinlik = derinlik;
          this.buyukluk = buyukluk;
          this.yer = yer;
          this.sehir = sehir;
        }
      }

      async function getirDepremler() {
        const url = 'http://www.koeri.boun.edu.tr/scripts/lst0.asp';
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const text = $('pre').text();
        let result = text.split('\n');
        result = result.splice(6); // İlk 6 satırı atladik

        const depremler = [];
        result.forEach(element => {
          const depremString = element.split(' ').filter(e => e.length > 0);
          if (depremString.length < 10) return;

          const [tarih, saat, enlem, boylam, derinlik, , buyukluk, , yer, sehir] = depremString;
          const deprem = new Deprem(tarih, saat, enlem, boylam, derinlik, buyukluk, yer, sehir);
          depremler.push(deprem);
        });

        console.log(`Deprem Tarama İşlemi Tamamlandı. Deprem Sayısı: ${depremler.length}`);
        return depremler;
      }

      const depremler = await getirDepremler();

      if (depremler.length > 0) {
        const enSon5Deprem = depremler.slice(0, 5); // İlk 5 deprem bilgisini aldik

        const embed = new MessageEmbed()
          .setColor('#ff7300')
          .setTitle('Son 5 Deprem')
          .setTimestamp()
          .setFooter('AFAD Deprem Verisi')
          .setDescription(
            enSon5Deprem.map(deprem => 
              `**Tarih:** ${deprem.tarih} ${deprem.saat}\n` +
              `**Enlem:** ${deprem.enlem} | **Boylam:** ${deprem.boylam}\n` +
              `**Derinlik:** ${deprem.derinlik} km | **Büyüklük:** ${deprem.buyukluk}\n` +
              `**Yer:** ${deprem.yer}\n` +
              `**Şehir:** ${deprem.sehir}\n` +
              `**Saat:** ${deprem.saat}`).join('\n\n')
          );

        await message.channel.send({ embeds: [embed] });
      } else {
        await message.channel.send('Deprem verisi bulunamadı.');
      }
    } catch (error) {
      console.error('Deprem verisi alınırken bir hata oluştu:', error);
      await message.channel.send('Deprem verilerini alırken bir hata oluştu.');
    }
  },
};
