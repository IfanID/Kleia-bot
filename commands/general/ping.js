const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Menampilkan latency bot."),
    
    async execute(interaction) {
        try {
            const botPing = interaction.client.ws.ping;

            const embed = new EmbedBuilder()
                .setColor("Random") // Warna acak setiap kali dikirim
                .setTitle("🏓 Pong!")
                .setDescription(`Latensi bot: **${botPing}ms**`)
                .setFooter({ text: "Bot aktif dan siap digunakan!" })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Error saat menjalankan /ping:", error);
            await interaction.reply({ content: "⚠️ Terjadi kesalahan saat menjalankan perintah.", ephemeral: true });
        }
    }
};