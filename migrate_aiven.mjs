import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
    // Gunakan DATABASE_URL dari terminal atau .env
    let uri = process.env.DATABASE_URL;
    
    if (!uri) {
        console.error("❌ ERROR: DATABASE_URL tidak ditemukan!");
        console.error("Pastikan Anda sudah menjalankan perintah ekspor (export DATABASE_URL='mysql://...')");
        process.exit(1);
    }
    
    // Hapus parameter ?ssl-mode=REQUIRED agar tidak memunculkan warning di mysql2
    if (uri.includes('?ssl-mode=')) {
        uri = uri.split('?')[0];
    }

    console.log("Menghubungkan ke Aiven...");
    
    let connection;
    try {
        connection = await mysql.createConnection({
            uri: uri,
            ssl: { rejectUnauthorized: false },
            multipleStatements: true
        });
        console.log("✅ Berhasil terhubung ke database cloud!");

        const schemaPath = path.join(__dirname, 'lib', 'schema.sql');
        const sql = await fs.readFile(schemaPath, 'utf-8');

        console.log("Memulai proses copy seluruh database lokal ke Aiven...");

        await connection.query(sql);
        
        console.log("🎉 SELAMAT! Seluruh tabel dan data lama berhasil dicopy ke Aiven.");
        
    } catch (error) {
        console.error("❌ Gagal terhubung atau mengeksekusi:", error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

runMigration();
