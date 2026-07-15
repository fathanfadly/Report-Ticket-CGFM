USE radiocityguide;

CREATE TABLE IF NOT EXISTS superadmins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Because you tried inserting before, we delete the bad row first if it exists
DELETE FROM superadmins WHERE username = 'superadmin';

-- Insert the default superadmin with username: superadmin and password: superadmin
INSERT INTO superadmins (username, password_hash)
VALUES ('superadmin', '$2b$10$0ljAwrHUhCIvbMHXZJ0Bw.CVmLkxt4LYjzYdRL8rq.q1Pny/7DjBq');
