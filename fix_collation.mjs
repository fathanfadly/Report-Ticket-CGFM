import mysql from 'mysql2/promise';

async function fix() {
    let uri = process.env.DATABASE_URL.split('?')[0];
    const connection = await mysql.createConnection({
        uri: uri,
        ssl: { rejectUnauthorized: false }
    });

    const tables = ['broadcasters_info', 'completed_tickets', 'reporters_info', 'superadmins', 'ticket_activities', 'tickets'];
    for (const table of tables) {
        console.log(`Fixing collation for ${table}...`);
        await connection.query(`ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    }
    console.log("All tables fixed!");
    connection.end();
}
fix();
