module.exports = (client) => {
    client.once("ready", async () => {
        try {
            if (!client.user) {
                console.error("Error: client.user tidak tersedia saat bot siap!");
                return;
            }

            console.log(`✅ Bot berhasil masuk sebagai ${client.user.tag}`);
            console.log(`🌐 Terhubung ke ${client.guilds.cache.size} server`);
            console.log(`👥 Mengelola ${client.users.cache.size} pengguna`);
            console.log("🚀 Bot siap digunakan!");
        } catch (error) {
            console.error("Error pada event ready:", error);
        }
    });
};