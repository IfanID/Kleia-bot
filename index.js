require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

// Ambil token dari .env
const TOKEN = process.env.TOKEN;
if (!TOKEN) {
    console.error("Error: Token bot tidak ditemukan! Pastikan file .env sudah diisi.");
    process.exit(1); // Keluar dari program jika token tidak ditemukan
}

// Inisialisasi client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// Fungsi untuk memuat event handler
const loadEvents = () => {
    try {
        require("./events/guild/interaction")(client);
        require("./events/client/ready")(client);
    } catch (error) {
        console.error("Error saat memuat event handler:", error);
    }
};

// Tangani error global agar bot tidak crash
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Jalankan bot
loadEvents();
client.login(TOKEN).catch((error) => {
    console.error("Gagal login ke Discord! Periksa token dan koneksi internet.");
    process.exit(1); // Keluar dari program jika gagal login
});