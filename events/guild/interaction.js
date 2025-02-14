const { readdirSync, statSync } = require("fs");
const path = require("path");
const { prefix } = require("../../config");
const { PermissionsBitField, MessageFlags } = require("discord.js");

module.exports = (client) => {
    const commands = new Map();

    // Fungsi untuk membaca command dari folder /commands
    const loadCommands = (dir) => {
        try {
            const items = readdirSync(dir);
            for (const item of items) {
                const fullPath = path.join(dir, item);
                if (statSync(fullPath).isDirectory()) {
                    loadCommands(fullPath);
                } else if (item.endsWith(".js")) {
                    try {
                        const command = require(fullPath);
                        if (command.data && typeof command.execute === "function") {
                            commands.set(command.data.name, command);
                        } else {
                            console.warn(`⚠️ Peringatan: Command di ${item} tidak memiliki "data" atau "execute"!`);
                        }
                    } catch (error) {
                        console.error(`❌ Error saat membaca command ${item}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error saat membaca folder commands:", error);
        }
    };

    loadCommands(path.join(__dirname, "../../commands"));

    // Event untuk Slash Command (`/`) - Khusus Admin
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);
        if (!command) {
            console.warn(`⚠️ Peringatan: Command "${interaction.commandName}" tidak ditemukan!`);
            return;
        }

        // Hanya Admin yang bisa pakai `/`
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: "⚠️ Kamu tidak memiliki izin untuk menggunakan perintah ini!",
                flags: MessageFlags.Ephemeral, // Gunakan flags agar hanya user yang melihat
            });
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`❌ Error saat menjalankan command "${interaction.commandName}":`, error);
            await interaction.reply({
                content: "⚠️ Terjadi kesalahan saat menjalankan perintah.",
                flags: MessageFlags.Ephemeral,
            });
        }
    });

    // Event untuk Prefix Command (`.3`) - Untuk Public
    client.on("messageCreate", async (message) => {
        if (message.author.bot || !message.content.startsWith(prefix)) return;

        let args = message.content.slice(prefix.length);

        // Abaikan jika ada lebih dari 1 spasi setelah prefix
        if (/^\s{2,}/.test(args)) return;

        // Hapus spasi berlebih & ambil command pertama
        args = args.trim().split(/\s+/);
        const commandName = args.shift()?.toLowerCase();

        if (!commandName) return;

        const command = commands.get(commandName);
        if (!command) {
            console.warn(`⚠️ Peringatan: Command dengan prefix ".3" "${commandName}" tidak ditemukan!`);
            return;
        }

        try {
            await command.execute(message);
        } catch (error) {
            console.error(`❌ Error saat menjalankan command "${commandName}":`, error);
            await message.reply("⚠️ Terjadi kesalahan saat menjalankan perintah.");
        }
    });
};