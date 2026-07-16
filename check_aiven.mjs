import mysql from 'mysql2/promise';

async function check() {
    let uri = process.env.DATABASE_URL;
    if (uri.includes('?ssl-mode=')) uri = uri.split('?')[0];
    const connection = await mysql.createConnection({
        uri: uri,
        ssl: { rejectUnauthorized: false }
    });
    const [tables] = await connection.query('SHOW TABLES');
    console.log("Tables in Aiven:", tables);
    
    if (tables.length > 0) {
        const [users] = await connection.query('SELECT * FROM superadmins');
        console.log("Superadmins in Aiven:", users);
        const [tickets] = await connection.query('SELECT * FROM tickets LIMIT 5');
        console.log("Tickets in Aiven:", tickets);
    }
    await connection.end();
}
check();
