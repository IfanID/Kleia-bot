const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const os = require("os");
const { version } = require("../../package.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("about")
        .setDescription("Menampilkan informasi lengkap tentang bot ini."),
    
    async execute(interaction) {
        try {
            const { client } = interaction;

            // Format uptime bot
            const uptime = client.uptime ? formatDuration(client.uptime) : "Tidak tersedia";

            // Buat embed utama
            const embed = new EmbedBuilder()
                .setColor("Aqua") // Warna Cyan
                .setTitle("🤖 Informasi Bot")
                .setDescription("Bot ini adalah asisten serbaguna yang siap membantu di server Anda!")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: "📛 Nama Bot", value: `\`${client.user.username}\``, inline: true },
                    { name: "🆔 ID Bot", value: `\`${client.user.id}\``, inline: true },
                    { name: "📡 Ping", value: `\`${Math.round(client.ws.ping)}ms\``, inline: true },
                    { name: "⏳ Uptime", value: `\`${uptime}\``, inline: true },
                    { name: "🛠 Versi Bot", value: `\`v${version}\``, inline: true },
                    { name: "🌍 Server Terhubung", value: `\`${client.guilds.cache.size}\``, inline: true },
                    { name: "👥 Pengguna Total", value: `\`${client.users.cache.size}\``, inline: true },
                    { name: "💻 Platform", value: `\`${os.platform()} (${os.arch()})\``, inline: true },
                    { name: "🟢 Node.js", value: `\`${process.version}\``, inline: true }
                )
                .setFooter({ text: "Bot ini aktif dan siap digunakan!", iconURL: client.user.displayAvatarURL() })
                .setTimestamp();

            // Kirim embed sebagai balasan
            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Error saat menjalankan /about:", error);
            await interaction.reply({ content: "⚠️ Terjadi kesalahan saat menjalankan perintah.", flags: 64 });
        }
    }
};

// Fungsi untuk format uptime (misal: "1 Hari, 2 Jam, 30 Menit, 15 Detik")
function formatDuration(ms) {
    if (typeof ms !== "number" || ms < 0) return "Tidak tersedia";

    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    return [
        days > 0 ? `${days} Hari` : "",
        hours > 0 ? `${hours} Jam` : "",
        minutes > 0 ? `${minutes} Menit` : "",
        seconds > 0 ? `${seconds} Detik` : "",
    ].filter(Boolean).join(", ");
}