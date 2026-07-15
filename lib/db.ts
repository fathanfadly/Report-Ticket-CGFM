import mysql from 'mysql2/promise';

const poolOptions: mysql.PoolOptions = {
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

if (process.env.DATABASE_URL) {
    let uri = process.env.DATABASE_URL;
    if (uri.includes('?ssl-mode=')) {
        uri = uri.split('?')[0];
    }
    Object.assign(poolOptions, { uri, ssl: { rejectUnauthorized: false } });
} else {
    Object.assign(poolOptions, {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'radiocityguide',
        port: Number(process.env.DB_PORT) || 3306,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
    });
}

const pool = mysql.createPool(poolOptions);

export default pool;
