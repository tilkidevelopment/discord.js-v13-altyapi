const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'xox',
  description: 'XOX oyunu oyna.',
  category: 'eglence',
  async execute(message, args) {
    const board = [
      '1', '2', '3',
      '4', '5', '6',
      '7', '8', '9'
    ];

    let currentPlayer = 'X';
    let gameActive = true;
    let playerX = message.author.id;
    let playerO = null;

    const renderBoard = () => {
      return new MessageEmbed()
        .setColor('#ff7300')
        .setTitle('XOX Oyunu')
        .setDescription(`\`\`\`
 ${board[0]} | ${board[1]} | ${board[2]} 
-----------
 ${board[3]} | ${board[4]} | ${board[5]} 
-----------
 ${board[6]} | ${board[7]} | ${board[8]} 
\`\`\``)
        .setFooter({ text: `Sıradaki oyuncu: ${currentPlayer}` });
    };

    const createButtons = () => {
      const row1 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('0')
            .setLabel(board[0])
            .setStyle('SECONDARY'),
          new MessageButton()
            .setCustomId('1')
            .setLabel(board[1])
            .setStyle('SECONDARY'),
          new MessageButton()
            .setCustomId('2')
            .setLabel(board[2])
            .setStyle('SECONDARY')
        );

      const row2 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('3')
            .setLabel(board[3])
            .setStyle('SECONDARY'),
          new MessageButton()
            .setCustomId('4')
            .setLabel(board[4])
            .setStyle('SECONDARY'),
          new MessageButton()
            .setCustomId('5')
            .setLabel(board[5])
            .setStyle('SECONDARY')
        );

      const row3 = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('6')
            .setLabel(board[6])
            .setStyle('SECONDARY'),
          new MessageButton()
            .setCustomId('7')
            .setLabel(board[7])
            .setStyle('SECONDARY'),
          new MessageButton()
            .setCustomId('8')
            .setLabel(board[8])
            .setStyle('SECONDARY')
        );

      return [row1, row2, row3];
    };

    const checkWin = () => {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      return winPatterns.some(pattern =>
        pattern.every(index => board[index] === currentPlayer)
      );
    };

    const makeMove = (index) => {
      if (board[index] !== 'X' && board[index] !== 'O') {
        board[index] = currentPlayer;
        return true;
      }
      return false;
    };

    const startButtonRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('start')
          .setLabel('Oyunu Başlat')
          .setStyle('PRIMARY')
      );

    const startMessage = await message.channel.send({
      content: 'XOX oyununa katılmak için butona tıklayın!',
      components: [startButtonRow]
    });

    const startFilter = i => i.customId === 'start' && i.user.id !== playerX;
    const startCollector = startMessage.createMessageComponentCollector({ startFilter, max: 1, time: 60000 });

    startCollector.on('collect', async (interaction) => {
      playerO = interaction.user.id;
      await interaction.update({
        content: `Oyun başladı! ${message.author.username} (X) vs ${interaction.user.username} (O)`,
        components: []
      });

      const gameMessage = await message.channel.send({
        embeds: [renderBoard()],
        components: createButtons()
      });

      const filter = i => [playerX, playerO].includes(i.user.id);

      const collector = gameMessage.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async (interaction) => {
        if (!gameActive) {
          interaction.reply({ content: 'Oyun zaten bitti.', ephemeral: true });
          return;
        }

        if (interaction.user.id !== (currentPlayer === 'X' ? playerX : playerO)) {
          interaction.reply({ content: 'Sıra sizde değil.', ephemeral: true });
          return;
        }

        let index = parseInt(interaction.customId);
        if (makeMove(index)) {
          if (checkWin()) {
            gameActive = false;
            await interaction.update({
              embeds: [renderBoard().setDescription(`Tebrikler! ${currentPlayer} kazandı!`)],
              components: []
            });
            collector.stop();
          } else if (board.every(cell => cell === 'X' || cell === 'O')) {
            gameActive = false;
            await interaction.update({
              embeds: [renderBoard().setDescription(`Oyun berabere!`)],
              components: []
            });
            collector.stop();
          } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            await interaction.update({
              embeds: [renderBoard()],
              components: createButtons()
            });
          }
        } else {
          interaction.reply({ content: 'Bu alan zaten dolu, lütfen başka bir yer seçin.', ephemeral: true });
        }
      });

      collector.on('end', async () => {
        if (gameActive) {
          await gameMessage.edit({
            embeds: [renderBoard().setDescription('Oyun süresi doldu! Yeniden oynamak için komutu tekrar kullanın.')],
            components: []
          });
        }
      });
    });

    startCollector.on('end', collected => {
      if (!collected.size) {
        startMessage.edit({
          content: 'Oyunu başlatmak için kimse butona tıklamadı. Komutu tekrar kullanarak oyunu başlatabilirsiniz.',
          components: []
        });
      }
    });
  }
};
