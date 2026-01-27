USE radiocityguide;

-- Recreate Reporters_Info
CREATE TABLE Reporters_Info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255) NOT NULL,
    tipe_pelapor VARCHAR(100),
    no_hp VARCHAR(50),
    alamat TEXT,
    pekerjaan VARCHAR(255),
    jabatan VARCHAR(255),
    pendidikan VARCHAR(255),
    usia INT,
    jenis_kelamin VARCHAR(50),
    hobi TEXT,
    pilihan_jenis_lagu TEXT,
    alat_transportasi TEXT,
    range_harga_gadget VARCHAR(100),
    radio_sering_diputar TEXT,
    acara_radio_favorit TEXT,
    objek_wisata_favorit TEXT,
    tv_sering_ditonton TEXT,
    acara_tv_favorit TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Recreate tickets
CREATE TABLE tickets (
    id VARCHAR(100) PRIMARY KEY,
    judul_laporan VARCHAR(255),
    priority VARCHAR(50),
    status VARCHAR(50),
    date_range VARCHAR(100),
    iso_date DATETIME,
    likes INT DEFAULT 0,
    image_url TEXT,
    tags JSON,
    description TEXT,
    reporter_id INT,
    kode_broadcaster VARCHAR(100),
    sumber_laporan VARCHAR(100),
    kategori_laporan VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES Reporters_Info(id) ON DELETE SET NULL
);

-- Recreate completed_tickets
CREATE TABLE completed_tickets (
    id VARCHAR(100) PRIMARY KEY,
    judul_laporan VARCHAR(255),
    priority VARCHAR(50),
    status VARCHAR(50),
    date_range VARCHAR(100),
    iso_date DATETIME,
    likes INT DEFAULT 0,
    image_url TEXT,
    tags JSON,
    description TEXT,
    solution TEXT,
    reporter_id INT,
    kode_broadcaster VARCHAR(100),
    sumber_laporan VARCHAR(100),
    kategori_laporan VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES Reporters_Info(id) ON DELETE SET NULL
);

-- Recreate Ticket_Activities
CREATE TABLE Ticket_Activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    activity_type VARCHAR(50) DEFAULT 'comment',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (ticket_id)
);
