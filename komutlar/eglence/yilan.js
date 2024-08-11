const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'yılan',
  description: 'Yılan oyununu başlatın.',
  category: 'eglence',
  async execute(message, args) {
    const boardSize = 10;
    let snake = [{ x: 5, y: 5 }];
    let apple = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
    let direction = null;
    let score = 0;
    let gameInterval;

    const renderBoard = () => {
      let board = '';
      for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
          if (snake.some(segment => segment.x === x && segment.y === y)) {
            board += '🟩';
          } else if (apple.x === x && apple.y === y) {
            board += '🍎';
          } else {
            board += '⬛';
          }
        }
        board += '\n';
      }
      return board;
    };

    const update = () => {
      if (!direction) return; // Bekle dur geçme

      const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
      
      if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize || snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return gameOver();
      }

      snake.unshift(head);
      
      if (head.x === apple.x && head.y === apple.y) {
        score++;
        apple = { x: Math.floor(Math.random() * boardSize), y: Math.floor(Math.random() * boardSize) };
      } else {
        snake.pop();
      }

      gameMessage.edit({ embeds: [getGameEmbed()] });
    };

    const getGameEmbed = () => {
      return new MessageEmbed()
        .setColor('#00FF00')
        .setTitle('Yılan Oyunu')
        .setDescription(renderBoard())
        .addField('Skor', score.toString())
        .setTimestamp()
        .setFooter({ text: 'Yılan Oyunu' });
    };

    const gameOver = () => {
      clearInterval(gameInterval);
      gameMessage.edit({ embeds: [getGameEmbed().setTitle('Oyun Bitti').setColor('#FF0000')] });
      gameMessage.components.forEach(row => row.components.forEach(button => button.setDisabled(true)));
      gameMessage.edit({ components: gameMessage.components });
    };

    const gameMessage = await message.channel.send({
      embeds: [getGameEmbed()],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton().setCustomId('up').setLabel('⬆️').setStyle('PRIMARY'),
          new MessageButton().setCustomId('left').setLabel('⬅️').setStyle('PRIMARY'),
          new MessageButton().setCustomId('down').setLabel('⬇️').setStyle('PRIMARY'),
          new MessageButton().setCustomId('right').setLabel('➡️').setStyle('PRIMARY')
        )
      ]
    });

    const buttonCollector = gameMessage.createMessageComponentCollector();

    buttonCollector.on('collect', buttonInteraction => {
      if (buttonInteraction.user.id !== message.author.id) return buttonInteraction.reply({ content: 'Bu oyun sizin için değil.', ephemeral: true });

      switch (buttonInteraction.customId) {
        case 'up':
          if (direction && direction.y === 1) break; // Geriye gitme yoksa kendini yersin uhu
          direction = { x: 0, y: -1 };
          break;
        case 'left':
          if (direction && direction.x === 1) break;
          direction = { x: -1, y: 0 };
          break;
        case 'down':
          if (direction && direction.y === -1) break;
          direction = { x: 0, y: 1 };
          break;
        case 'right':
          if (direction && direction.x === -1) break;
          direction = { x: 1, y: 0 };
          break;
      }
      buttonInteraction.deferUpdate();
    });

    gameInterval = setInterval(update, 1000);
  },
};
