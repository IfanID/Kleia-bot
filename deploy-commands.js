const { REST, Routes } = require("discord.js");  
const fs = require("fs");  
require("dotenv").config();  
  
// Ambil variabel dari .env  
const TOKEN = process.env.TOKEN;  
const CLIENT_ID = process.env.CLIENT_ID;  
const GUILD_ID = process.env.GUILD_ID;  
  
// Cek apakah variabel penting tersedia  
if (!TOKEN || !CLIENT_ID || !GUILD_ID) {  
    console.error("❌ Error: TOKEN, CLIENT_ID, atau GUILD_ID tidak ditemukan di .env!");  
    process.exit(1); // Hentikan proses jika ada yang hilang  
}  
  
const commands = [];  
const commandsPath = "./commands";  
  
// Fungsi untuk membaca command dari subfolder dalam /commands  
const readCommands = (folderPath) => {  
    try {  
        const items = fs.readdirSync(folderPath);  
        for (const item of items) {  
            const itemPath = `${folderPath}/${item}`;  
            if (fs.statSync(itemPath).isDirectory()) {  
                readCommands(itemPath);  
            } else if (item.endsWith(".js")) {  
                try {  
                    const command = require(itemPath);  
                    if (command.data) {  
                        commands.push(command.data.toJSON());  
                    } else {  
                        console.warn(`⚠️ Peringatan: Command di ${item} tidak memiliki "data"!`);  
                    }  
                } catch (error) {  
                    console.error(`❌ Error saat membaca command di ${itemPath}:`, error);  
                }  
            }  
        }  
    } catch (error) {  
        console.error("❌ Error saat membaca folder commands:", error);  
    }  
};  
  
readCommands(commandsPath);  
  
// Inisialisasi REST API untuk Discord  
const rest = new REST({ version: "10" }).setToken(TOKEN);  
  
(async () => {  
    try {  
        console.log(`🔄 Menghapus semua command di server ${GUILD_ID}...`);  
        const deletedCommands = await rest.put(  
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),  
            { body: [] }  
        );  
        console.log(`✅ ${deletedCommands.length} command dihapus.`);  
  
        console.log(`➕ Menambahkan ${commands.length} perintah baru...`);  
        const addedCommands = await rest.put(  
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),  
            { body: commands }  
        );  
        console.log(`✅ ${addedCommands.length} command ditambahkan!`);  
  
        console.log("🚀 Semua command telah diperbarui dengan sukses!");  
    } catch (error) {  
        console.error("❌ Error saat mendaftarkan command:", error);  
    }  
})();  