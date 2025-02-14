const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
const { prefix } = require("../../config"); // Ambil prefix dari config.js

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Menampilkan daftar perintah yang tersedia."),
    
    async execute(interaction) {
        try {
            const commandsPath = path.join(__dirname, "..");
            const commandList = [];

            // Fungsi untuk membaca command dari folder commands
            const readCommands = (folderPath) => {
                const items = fs.readdirSync(folderPath);
                for (const item of items) {
                    const itemPath = path.join(folderPath, item);
                    if (fs.statSync(itemPath).isDirectory()) {
                        readCommands(itemPath);
                    } else if (item.endsWith(".js")) {
                        const command = require(itemPath);
                        if (command.data) {
                            const isSlashCommand = command.data.name.startsWith("/");
                            const isAdminCommand = command.adminOnly || false; // Cek apakah command khusus admin
                            const commandName = isSlashCommand 
                                ? `</${command.data.name}:0>` // Format untuk menampilkan slash command di Discord
                                : `\`${prefix} ${command.data.name}\``; // Tambahkan spasi setelah prefix dan beri highlight

                            commandList.push({
                                name: commandName,
                                description: command.data.description,
                                admin: isAdminCommand
                            });
                        }
                    }
                }
            };

            readCommands(commandsPath);

            // Buat embed daftar command
            const embed = new EmbedBuilder()
                .setColor("Gold") // Warna emas biar lebih menarik
                .setTitle("📜 **Daftar Perintah Bot**")
                .setDescription(
                    "Berikut adalah daftar perintah yang tersedia:\n\n" +
                    "🟢 **Slash Commands ( / )** " +
                    "[ 👑 Admin Only ]\n" +
                    "🔵 **Prefix Commands ( .3 )** " +
                    "[ 👤 User ]\n"
                )
                .addFields(
                    commandList.map(cmd => ({
                        name: `🔹 ${cmd.name} ${cmd.admin ? "👑" : ""}`, // Tambahkan ikon admin hanya untuk perintah admin
                        value: cmd.description,
                        inline: false
                    }))
                )
                .setFooter({
                    text: "Gunakan perintah dengan benar!",
                    iconURL: interaction.client.user.displayAvatarURL()
                })
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Error saat menjalankan /help:", error);
            await interaction.reply({ content: "⚠️ Terjadi kesalahan saat menjalankan perintah.", ephemeral: true });
        }
    }
};