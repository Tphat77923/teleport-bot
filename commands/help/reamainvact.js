const { Client, Interaction, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'remainvact',
  category: '⏳Đếm ngược',
  description: 'Đếm ngược thời gian đến kỳ thi VACT (7h sáng 24/5/2026)',

  /**
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const examDate = new Date('2026-05-24T07:00:00+07:00');
    const now = new Date();
    const diff = examDate - now;

    let description;
    let color;

    if (diff <= 0) {
      description = '🎉 Kỳ thi VACT **đã bắt đầu** (hoặc đã kết thúc)!\nChúc các bạn thi thật tốt! 💪';
      color = '#ff6b6b';
    } else {
      const totalSeconds = Math.floor(diff / 1000);
      const days    = Math.floor(totalSeconds / 86400);
      const hours   = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      description = [
        `📅 **Ngày thi:** Thứ Bảy, 24/05/2026 lúc **07:00 sáng**`,
        ``,
        `⏳ **Thời gian còn lại:**`,
        `\`\`\``,
        `  ${days} ngày`,
        `  ${hours} giờ`,
        `  ${minutes} phút`,
        `  ${seconds} giây`,
        `\`\`\``,
        `📌 Cố lên nào! Ôn tập chăm chỉ nhé! 📚`,
      ].join('\n');
      color = '#f0a500';
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setTitle('📝 Đếm ngược kỳ thi VACT 2026')
      .setDescription(description)
      .setFooter({ text: 'Teleport Bot • Chúc bạn thi tốt!', iconURL: 'https://i.imgur.com/Dqz0j0F.png' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
