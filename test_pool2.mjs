import mysql from 'mysql2/promise';
async function test() {
    try {
        let uri = process.env.DATABASE_URL.split('?')[0]; // strip ?ssl-mode=REQUIRED
        const pool = mysql.createPool({
            uri: uri,
            ssl: { rejectUnauthorized: false }
        });
        const [rows] = await pool.query('SELECT 1');
        console.log("Success:", rows);
        pool.end();
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
