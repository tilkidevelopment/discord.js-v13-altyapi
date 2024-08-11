const fs = require('fs');
const path = require('path');
const { Client, Intents, Collection } = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES
  ]
});
client.commands = new Collection();

// Komut dosyalarını yükleme
const commandFolders = ['eglence', 'genel', 'kullanici', 'moderasyon', 'ekonomi'];

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(path.join(__dirname, 'komutlar', folder)).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(__dirname, 'komutlar', folder, file));
    client.commands.set(command.name, command);
  }
}

client.once('ready', () => {
  console.log('Bot Aktif Edildi!');
  client.user.setPresence({
    activities: [{ name: 'Komutlarımı bakman için t!yardım', type: 'PLAYING' }],
    status: 'online',
  });
});

client.on('messageCreate', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (client.commands.has(commandName)) {
    const command = client.commands.get(commandName);

    try {
      await command.execute(message, args, client);
    } catch (error) {
      console.error(error);
      message.reply('Bu komutu yürütmeye çalışırken bir hata oluştu!');
    }
  }

  
});


client.login(token);
