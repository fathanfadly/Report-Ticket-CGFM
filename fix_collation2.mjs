import mysql from 'mysql2/promise';

async function fix() {
    let uri = process.env.DATABASE_URL.split('?')[0];
    const connection = await mysql.createConnection({
        uri: uri,
        ssl: { rejectUnauthorized: false },
        multipleStatements: true
    });

    try {
        await connection.query('SET foreign_key_checks = 0;');
        
        // Let's also alter the database itself so new tables don't get 0900_ai_ci
        try {
            await connection.query('ALTER DATABASE defaultdb CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;');
        } catch(e) {} // May not have permission, ignore

        const tables = ['broadcasters_info', 'completed_tickets', 'reporters_info', 'superadmins', 'ticket_activities', 'tickets'];
        for (const table of tables) {
            console.log(`Fixing collation for ${table}...`);
            await connection.query(`ALTER TABLE ${table} CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;`);
        }
        await connection.query('SET foreign_key_checks = 1;');
        console.log("All tables fixed!");
    } catch (err) {
        console.error(err);
    }
    connection.end();
}
fix();
