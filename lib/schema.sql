-- Create Ticket_Activities table for CGFM Report Activity / Comments
CREATE TABLE IF NOT EXISTS Ticket_Activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(50) NOT NULL, -- UUID or short ID
    content TEXT NOT NULL,
    activity_type VARCHAR(50) DEFAULT 'comment', -- 'comment', 'status_update', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (ticket_id)
);
