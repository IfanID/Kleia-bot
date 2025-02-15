require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

// Cek apakah variabel di .env tersedia
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

console.log("📌 Mengecek file .env...");

if (!TOKEN) {
    console.error("❌ Error: TOKEN tidak ditemukan di .env!");
} else {
    console.log("✅ TOKEN ditemukan.");
}

if (!CLIENT_ID) {
    console.error("❌ Error: CLIENT_ID tidak ditemukan di .env!");
} else {
    console.log("✅ CLIENT_ID ditemukan.");
}

if (!GUILD_ID) {
    console.error("❌ Error: GUILD_ID tidak ditemukan di .env!");
} else {
    console.log("✅ GUILD_ID ditemukan.");
}

// Cek koneksi ke Discord
if (TOKEN) {
    console.log("🔄 Mengecek koneksi ke Discord...");

    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once("ready", () => {
        console.log(`✅ Bot berhasil terhubung ke Discord sebagai ${client.user.tag}!`);
        client.destroy(); // Tutup koneksi setelah tes selesai
    });

    client.login(TOKEN).catch((error) => {
        console.error("❌ Gagal terhubung ke Discord! Periksa token di .env.", error);
    });
}