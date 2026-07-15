-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: radiocityguide
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `broadcasters_info`
--

DROP TABLE IF EXISTS `broadcasters_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `broadcasters_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `broadcaster_code` varchar(50) NOT NULL,
  `broadcaster_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `broadcaster_code` (`broadcaster_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `broadcasters_info`
--

LOCK TABLES `broadcasters_info` WRITE;
/*!40000 ALTER TABLE `broadcasters_info` DISABLE KEYS */;
INSERT INTO `broadcasters_info` VALUES (1,'BC001','Syam','123456','2026-03-18 22:14:51','2026-03-18 22:14:51'),(2,'BC002','FathanFadly','123456','2026-05-02 15:17:10','2026-05-02 15:17:10'),(3,'BC003','Ahmad','123456','2026-05-16 11:06:39','2026-05-16 11:06:39'),(4,'BC004','Budi','123456','2026-05-16 11:06:39','2026-05-16 11:06:39'),(5,'BC005','Citra','123456','2026-05-16 11:06:39','2026-05-16 11:06:39');
/*!40000 ALTER TABLE `broadcasters_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `completed_tickets`
--

DROP TABLE IF EXISTS `completed_tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `completed_tickets` (
  `id` varchar(100) NOT NULL,
  `judul_laporan` varchar(255) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `date_range` varchar(100) DEFAULT NULL,
  `iso_date` datetime DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `image_url` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `description` text DEFAULT NULL,
  `solution` text DEFAULT NULL,
  `reporter_id` int(11) DEFAULT NULL,
  `kode_broadcaster` varchar(100) DEFAULT NULL,
  `sumber_laporan` varchar(100) DEFAULT NULL,
  `kategori_laporan` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reporter_id` (`reporter_id`),
  KEY `kode_broadcaster` (`kode_broadcaster`),
  CONSTRAINT `completed_tickets_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `reporters_info` (`id`) ON DELETE SET NULL,
  CONSTRAINT `completed_tickets_ibfk_2` FOREIGN KEY (`kode_broadcaster`) REFERENCES `broadcasters_info` (`broadcaster_code`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completed_tickets`
--

LOCK TABLES `completed_tickets` WRITE;
/*!40000 ALTER TABLE `completed_tickets` DISABLE KEYS */;
INSERT INTO `completed_tickets` VALUES ('CMT001','Genangan Air','P2','completed','Last week','2026-05-01 00:00:00',5,NULL,'[]','Genangan air di jalan raya','Sudah dibersihkan dan dialirkan',1,'BC001','WhatsApp','Infrastruktur','2026-05-02 03:00:00'),('CMT002','Macet Parah','P1','completed','Last month','2026-04-20 00:00:00',10,NULL,'[]','Kemacetan parah di jam pulang kerja','Dikirimkan petugas pengatur lalu lintas',2,'BC002','Telepon','Lalu Lintas','2026-04-21 08:00:00');
/*!40000 ALTER TABLE `completed_tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reporters_info`
--

DROP TABLE IF EXISTS `reporters_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reporters_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) NOT NULL,
  `tipe_pelapor` varchar(100) DEFAULT NULL,
  `no_hp` varchar(50) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `pekerjaan` varchar(255) DEFAULT NULL,
  `jabatan` varchar(255) DEFAULT NULL,
  `pendidikan` varchar(255) DEFAULT NULL,
  `usia` int(11) DEFAULT NULL,
  `jenis_kelamin` varchar(50) DEFAULT NULL,
  `hobi` text DEFAULT NULL,
  `pilihan_jenis_lagu` text DEFAULT NULL,
  `alat_transportasi` text DEFAULT NULL,
  `range_harga_gadget` varchar(100) DEFAULT NULL,
  `radio_sering_diputar` text DEFAULT NULL,
  `acara_radio_favorit` text DEFAULT NULL,
  `objek_wisata_favorit` text DEFAULT NULL,
  `tv_sering_ditonton` text DEFAULT NULL,
  `acara_tv_favorit` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reporters_info`
--

LOCK TABLES `reporters_info` WRITE;
/*!40000 ALTER TABLE `reporters_info` DISABLE KEYS */;
INSERT INTO `reporters_info` VALUES (1,'Syam','Masyarakat','082145159707','Jalan XX','Pelajar/Mahasiswa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-27 08:29:35'),(2,'asda','Polisi','0821461010231','asfdasd','Karyawan','','',12,'','','','','','','','','','','2026-01-27 08:30:03'),(3,'Justin','Masyarakat','081111111111','adas','Karyawan',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-01-27 08:45:09'),(4,'Fathan','Masyarakat','082222222222','Alamat XX','Pelajar/Mahasiswa',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-18 03:19:12'),(5,'Saeb','Polisi','0852362712','Sumatera','Wiraswasta',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-05-07 13:08:20'),(6,'Rina','Masyarakat','081234567890','Jakarta','Ibu Rumah Tangga',NULL,'SMA',28,'Perempuan','Memasak','Pop','Motor','2-3 Juta','Prambors','Morning Show','Ancol','RCTI','Indonesian Idol','2026-05-16 11:07:21'),(7,'Andi','Mahasiswa','081298765432','Bandung','Mahasiswa',NULL,'S1',22,'Laki-laki','Game','Rock','Motor','3-5 Juta','Hard Rock FM','Rock Hour','Tangkuban Perahu','Trans TV','Dunia Games','2026-05-16 11:07:21'),(8,'Siti','Guru','085612345678','Surabaya','Guru','Honorer','S1',35,'Perempuan','Membaca','Dangdut','Mobil','1-2 Juta','Delta FM','Dangdut Academy','Pantai Kenjeran','Indosiar','Ftv','2026-05-16 11:07:21');
/*!40000 ALTER TABLE `reporters_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `superadmins`
--

DROP TABLE IF EXISTS `superadmins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `superadmins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `superadmins`
--

LOCK TABLES `superadmins` WRITE;
/*!40000 ALTER TABLE `superadmins` DISABLE KEYS */;
INSERT INTO `superadmins` VALUES (2,'superadmin','$2b$10$vpsohnz5IT/Aaurj90ZhnuJtNOPhR8Ry2SyiSvdUXZApCaZXbPvNq','2026-05-02 15:04:32');
/*!40000 ALTER TABLE `superadmins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_activities`
--

DROP TABLE IF EXISTS `ticket_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ticket_activities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ticket_id` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `activity_type` varchar(50) DEFAULT 'comment',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `ticket_status` varchar(50) DEFAULT NULL,
  `created_by_name` varchar(100) DEFAULT NULL,
  `created_by_code` varchar(50) DEFAULT NULL,
  `user_role` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `ticket_activities_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `tickets` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_activities`
--

LOCK TABLES `ticket_activities` WRITE;
/*!40000 ALTER TABLE `ticket_activities` DISABLE KEYS */;
INSERT INTO `ticket_activities` VALUES (1,'TKT001','Laporan banjir diterima','comment','2026-05-14 11:07:49','new',NULL,NULL,NULL),(2,'TKT001','Sedang ditangani oleh broadcaster BC001','status_change','2026-05-15 11:07:49','in_progress',NULL,NULL,NULL),(3,'TKT001','Tim sudah menuju lokasi','comment','2026-05-16 11:07:49','in_progress',NULL,NULL,NULL),(4,'TKT002','Laporan kebakaran masuk','comment','2026-05-13 11:07:49','new',NULL,NULL,NULL),(5,'TKT002','Sedang dalam penilaian','status_change','2026-05-14 11:07:49','assessment',NULL,NULL,NULL),(6,'TKT003','Laporan jalan rusak','comment','2026-05-12 11:07:49','new',NULL,NULL,NULL),(7,'TKT003','Masuk backlog','status_change','2026-05-13 11:07:49','backlog',NULL,NULL,NULL),(8,'TKT004','Laporan pohon tumbang','comment','2026-05-14 11:07:49','new',NULL,NULL,NULL),(9,'TKT004','Status urgent, segera ditangani','status_change','2026-05-15 11:07:49','urgent',NULL,NULL,NULL),(10,'TKT005','secepatnya','comment','2026-05-28 03:12:16','new',NULL,NULL,NULL),(11,'1o0lsmzh2','lokasi kejadian di jalan Majapahit','comment','2026-05-28 03:12:40','assessment',NULL,NULL,NULL),(12,'jqtq3wnzj','time menuju lokasi','comment','2026-05-28 03:26:00','assessment',NULL,NULL,NULL);
/*!40000 ALTER TABLE `ticket_activities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tickets` (
  `id` varchar(100) NOT NULL,
  `judul_laporan` varchar(255) DEFAULT NULL,
  `priority` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `date_range` varchar(100) DEFAULT NULL,
  `iso_date` datetime DEFAULT NULL,
  `likes` int(11) DEFAULT 0,
  `image_url` text DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `description` text DEFAULT NULL,
  `reporter_id` int(11) DEFAULT NULL,
  `kode_broadcaster` varchar(100) DEFAULT NULL,
  `sumber_laporan` varchar(100) DEFAULT NULL,
  `kategori_laporan` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `reporter_id` (`reporter_id`),
  KEY `kode_broadcaster` (`kode_broadcaster`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`reporter_id`) REFERENCES `reporters_info` (`id`) ON DELETE SET NULL,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`kode_broadcaster`) REFERENCES `broadcasters_info` (`broadcaster_code`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES ('1o0lsmzh2','kecelakaan tunggal','P2','assessment','Recently added','2026-05-28 00:00:00',0,NULL,'[]',NULL,7,'BC004','Instagram','Lain-lain','2026-05-28 03:01:06'),('jqtq3wnzj','Banjir bandang aceh 2026','P1','assessment','Recently added','2026-05-28 00:00:00',0,NULL,'[]',NULL,8,'BC001','WhatsApp','Infrastruktur','2026-05-28 03:23:12'),('TKT001','Banjir di Jalan Sudirman','P1','in_progress','Recently added','2026-05-15 00:00:00',0,NULL,'[]','Banjir setinggi 50cm menggenangi Jalan Sudirman',1,'BC001','WhatsApp','Infrastruktur','2026-05-16 11:07:38'),('TKT002','Kebakaran Pasar','P1','assessment','Recently added','2026-05-14 00:00:00',0,NULL,'[]','Kebakaran melanda pasar tradisional',2,NULL,'Telepon','Keamanan','2026-05-16 11:07:38'),('TKT003','Jalan Rusak Berlubang','P3','backlog','Recently added','2026-05-13 00:00:00',0,NULL,'[]','Jalan rusak berlubang di depan sekolah',3,NULL,'WhatsApp','Infrastruktur','2026-05-16 11:07:38'),('TKT004','Pohon Tumbang','P2','urgent','Recently added','2026-05-12 00:00:00',0,NULL,'[]','Pohon tumbang menutup akses jalan',4,'BC002','Telepon','Infrastruktur','2026-05-16 11:07:38'),('TKT005','Kecelakaan Lalu Lintas','P1','new','Recently added','2026-05-16 00:00:00',0,NULL,'[]','Kecelakaan antara mobil dan motor',5,'BC004','WhatsApp','Keamanan','2026-05-16 11:07:38'),('TKT006','Lampu Jalan Mati','P3','new','Recently added','2026-05-16 00:00:00',0,NULL,'[]','Lampu jalan mati di area perumahan',6,NULL,'Telepon','Infrastruktur','2026-05-16 11:07:38'),('TKT007','Sampah Menumpuk','P4','backlog','Recently added','2026-05-15 00:00:00',0,NULL,'[]','Sampah menumpuk di sungai',7,NULL,'WhatsApp','Lingkungan','2026-05-16 11:07:38'),('TKT008','Gangguan Listrik','P2','in_progress','Recently added','2026-05-14 00:00:00',0,NULL,'[]','Gangguan listrik di 3 desa',8,'BC003','Telepon','Infrastruktur','2026-05-16 11:07:38');
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 21:37:08
