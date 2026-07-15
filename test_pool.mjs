import mysql from 'mysql2/promise';
async function test() {
    try {
        const poolOptions = {
            uri: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        };
        const pool = mysql.createPool(poolOptions);
        const [rows] = await pool.query('SELECT 1');
        console.log("Success:", rows);
        pool.end();
    } catch (e) {
        console.error("Error:", e.message);
    }
}
test();
