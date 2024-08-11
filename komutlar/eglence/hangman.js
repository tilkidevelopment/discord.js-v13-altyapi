const { MessageEmbed } = require('discord.js');

// karakterleri buraya ekleyebilirsin benim gibi :D
const words = [
  'elma', 'muz', 'üzüm', 'portakal', 'çilek', 'karpuz', 'kavun', 'armut', 'şeftali', 'kiraz',
  'nar', 'böğürtlen', 'yaban mersini', 'ayva', 'mandalina', 'kivi', 'ananas', 'zeytin', 'vişne', 'limon',
  'erik', 'greyfurt', 'narenciye', 'havuç', 'tuzlu yoğurt', 'kavanoz', 'şeker', 'bal', 'biber', 'karnabahar',
  'patates', 'domates', 'soğan', 'sarımsak', 'biber', 'brokoli', 'ıspanak', 'havuç', 'kabak', 'karnabahar',
  'bezelye', 'mantar', 'patlıcan', 'marul', 'roka', 'dereotu', 'nane', 'zeytin', 'karnabahar', 'lahana',
  'turp', 'soya fasulyesi', 'yaz salatası', 'kuru fasulye', 'nohut', 'mercimek', 'patlıcan', 'kavun', 'elma', 'muz',
  'masa', 'sandalyeler', 'bilgisayar', 'telefon', 'kitap', 'defter', 'kalem', 'silgi', 'klavye', 'mouse',
  'yastık', 'yatak', 'halı', 'perde', 'koltuk', 'lamba', 'televizyon', 'buzdolabı', 'ocak', 'fırın',
  'bulaşık makinesi', 'çamaşır makinesi', 'komodin', 'çekyat', 'sehpa', 'ayna', 'dolap', 'kanepe', 'güverte', 'tablo',
  'kedi', 'köpek', 'kuş', 'at', 'inek', 'koyun', 'keçi', 'tavuk', 'ördek', 'güvercin',
  'balina', 'köpekbalığı', 'yılan', 'kurbağa', 'fare', 'sincap', 'zebra', 'aslan', 'kaplan', 'fil',
  'panda', 'kanguru', 'zürafa', 'yılan', 'sincap', 'tavşan', 'hamster', 'kurt', 'vampir', 'kaplumbağa',
  'istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 'konya', 'adana', 'gaziantep', 'eskişehir', 'trabzon',
  'rize', 'samsun', 'denizli', 'kayseri', 'manisa', 'balıkesir', 'ordu', 'mardin', 'kocaeli', 'bolu',
  'çorum', 'batman', 'sivas', 'zonguldak', 'sakarya', 'afyonkarahisar', 'bilecik', 'karaman', 'nevsehir', 'ağrı',
  'amerika', 'almanya', 'fransa', 'italya', 'ispanya', 'ingiltere', 'japonya', 'çin', 'hindistan', 'brazil',
  'arjantin', 'kanada', 'avustralya', 'meksika', 'rusya', 'türkiye', 'yunanistan', 'güneyafrika', 'kırgızistan', 'yeni zelanda',
  'anahtar', 'kapı', 'pencere', 'yüzük', 'bilezik', 'kolye', 'saati', 'parmaklık', 'sepet', 'kupa',
  'tabak', 'bardak', 'çatal', 'bıçak', 'kaşık', 'şamdan', 'mum', 'çerçeve', 'fotoğraf', 'telefona',
  'dizüstü bilgisayar', 'projektör', 'teyp', 'radyo', 'video kamera', 'gitar', 'piyano', 'akordeon', 'sitar', 'saksafon',
  'gözlük', 'şapka', 'ayakkabı', 'çanta', 'bel çantası', 'saat', 'bere', 'ceket', 'mont', 'eldiven',
  'şort', 'elbise', 'tişört', 'pantolon', 'etek', 'kravat', 'kemer', 'şal', 'çorap', 'bot',
  'ayakkabı', 'terlik', 'gömlek', 'ceket', 'kaban', 'battaniye', 'yastık', 'örme', 'çizme', 'kürk'
];

module.exports = {
  name: 'hangman',
  description: 'Kelime bulmaca oyunu.',
  category: 'eglence',
  async execute(message, args) {
    const word = words[Math.floor(Math.random() * words.length)];
    let hiddenWord = '_'.repeat(word.length).split('');
    let attempts = 6;
    let guessedLetters = [];

    // Gizli kelimeyi güncelleme (opsiyonel)
    const updateHiddenWord = () => {
      hiddenWord = word.split('').map(letter => 
        guessedLetters.includes(letter) ? letter : '_'
      );
    };

    const renderWord = () => hiddenWord.join(' ');

    const getGameEmbed = () => {
      return new MessageEmbed()
        .setColor('#00FF00')
        .setTitle('Kelime Bulmaca')
        .setDescription(renderWord())
        .addField('Kalan Deneme Hakkı', attempts.toString())
        .addField('Tahmin Edilen Harfler', guessedLetters.join(', ') || 'Yok')
        .setTimestamp()
        .setFooter({ text: 'Kelime Bulmaca' });
    };

    const gameMessage = await message.channel.send({ embeds: [getGameEmbed()] });

    const filter = response => {
      // Türkçe karakterler dahil tüm tek harfleri kabul et (opsiyonel)
      return response.author.id === message.author.id && /^[a-zA-ZıİşŞğĞüÜçÇöÖ]$/.test(response.content);
    };

    const collector = message.channel.createMessageCollector({ filter, time: 60000 });

    collector.on('collect', msg => {
      const letter = msg.content.toLowerCase();
      msg.delete();

      if (guessedLetters.includes(letter)) {
        return message.channel.send('Bu harfi zaten tahmin ettiniz.').then(msg => setTimeout(() => msg.delete(), 3000));
      }

      guessedLetters.push(letter);

      if (word.includes(letter)) {
        updateHiddenWord();
      } else {
        attempts--;
      }

      if (hiddenWord.join('') === word) {
        collector.stop();
        return gameMessage.edit({ embeds: [getGameEmbed().setTitle('Kazandınız!').setColor('#00FF00')] });
      }

      if (attempts <= 0) {
        collector.stop();
        return gameMessage.edit({ embeds: [getGameEmbed().setTitle('Kaybettiniz!').setColor('#FF0000').addField('Kelime', word)] });
      }

      gameMessage.edit({ embeds: [getGameEmbed()] });
    });

    collector.on('end', collected => {
      if (hiddenWord.join('') !== word && attempts > 0) {
        gameMessage.edit({ embeds: [getGameEmbed().setTitle('Süre doldu!').setColor('#FF0000').addField('Kelime', word)] });
      }
    });
  }
};
