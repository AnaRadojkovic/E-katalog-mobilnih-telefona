-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.29 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for appmobtel
CREATE DATABASE IF NOT EXISTS `appmobtel` /*!40100 DEFAULT CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `appmobtel`;

-- Dumping structure for table appmobtel.administrator
CREATE TABLE IF NOT EXISTS `administrator` (
  `administrator_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `password_hash` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `is_active` tinyint DEFAULT '0',
  PRIMARY KEY (`administrator_id`),
  UNIQUE KEY `uq_administrator_username` (`username`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table appmobtel.administrator: ~9 rows (approximately)
DELETE FROM `administrator`;
INSERT INTO `administrator` (`administrator_id`, `username`, `password_hash`, `is_active`) VALUES
	(1, 'adminana', '$2b$11$N3O18SYS2f9.SoEc9KcDNurZv6A8qB2pO/5vAChz0qIk8MPTdrps2', 1),
	(2, 'admin 1', '2222', 1),
	(4, 'admin 2', '$2b$11$PJvRe7DCjaa8H7n0kpLwTuLFxcB7hMqV2TkyOocsgksMwrUQL7Vrm', 0),
	(6, 'admin 12345', '$2b$11$8lQDNfRZLje76JMOQGA8H.BFQNShQwApUSqDcXTxKk/oPUqP9fGzS', 1),
	(7, 'admin 1234', '$2b$11$5GRlw5w4rNZbxnIG/BXSVO2mYdmzLJBGlVQf0JzIg6CjwE1P1ijhS', 1),
	(8, 'admin 11111', '$2b$11$TJFYTv3h6DC15xUGR9jWguiUQtvmd/B741tp0CQ/BtxtJKwuc2Mj2', 1),
	(9, 'admin 22222', '$2b$11$iUM/xXElwD4/Sw9taPaFT.LtjVCsj79U5ebM3KgLdCxs4F6RIK1Ee', 0),
	(10, 'admin 333', '$2b$11$f6k0ZdOI8NwoNAO0pj/NnuYyC54JZUZyy./Nky6RnLfzipv6vwGby', 1),
	(13, 'anaadmin1', '$2b$11$HskknI0J7YzD.u5u60l90ep8TbMA6KOR0nCnXNWoLBvn8VmSdzO5u', 1);

-- Dumping structure for table appmobtel.article
CREATE TABLE IF NOT EXISTS `article` (
  `article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL DEFAULT '0',
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `description` text COLLATE utf8_unicode_ci NOT NULL,
  `os` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL,
  `ram_memory` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `internal_memory` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `resolution` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `display_size` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `selfie_camera` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `main_camera` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `procesor` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `bluetooth` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `wifi` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `network` text CHARACTER SET utf8mb3 COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `price` decimal(10,2) unsigned NOT NULL,
  PRIMARY KEY (`article_id`),
  KEY `fk_article_category_id` (`category_id`),
  CONSTRAINT `fk_article_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table appmobtel.article: ~4 rows (approximately)
DELETE FROM `article`;
INSERT INTO `article` (`article_id`, `category_id`, `name`, `description`, `os`, `ram_memory`, `internal_memory`, `resolution`, `display_size`, `selfie_camera`, `main_camera`, `procesor`, `bluetooth`, `wifi`, `network`, `created_at`, `price`) VALUES
	(1, 1, 'nokia', 'dobar tel', 'android 12', '8GB', '64GB', '2400x1080', '6.44\'\'', '13mp-f 2.2+2mp-f 2.4', '5mp-f 2.2', 'octa core is avtsa nesto', 'v5.0', 'wi-fi 802', 'svast', '2022-06-22 09:27:11', 8.00),
	(4, 1, 'artikal 2022', 'opis ertikla 2022', 'dodat novi android', '6gb', '32gb', '2400x1800', '5.99\'\'', '18mp - f 2.2', '58mp -f 2.2 + 12mp - f 2.4 + 5mp - f 2.3', '8 octa core', 'v5.1', 'wi-fi 252', 'GSM 850/900/1800/1900 MHz', '2022-06-22 10:39:27', 4.40),
	(5, 1, 'samsung', 'opis ertikla 2022', 'dodat novi android', '6gb', '32gb', '2400x1800', '5.99\'\'', '18mp - f 2.2', '58mp -f 2.2 + 12mp - f 2.4 + 5mp - f 2.3', '8 octa core', 'v5.1', 'wi-fi 252', 'GSM 850/900/1800/1900 MHz', '2022-06-22 10:54:28', 4.60),
	(6, 1, 'xiaomi', 'opis ertikla 2022', 'dodat novi android', '6gb', '32gb', '2400x1800', '5.99\'\'', '18mp - f 2.2', '58mp -f 2.2 + 12mp - f 2.4 + 5mp - f 2.3', '8 octa core', 'v5.1', 'wi-fi 252', 'GSM 850/900/1800/1900 MHz', '2022-06-22 10:55:41', 0.50),
	(7, 1, 'novi samsung', 'opis artikla 2022', ' android', '6gb', '32gb', '2400x1800', '5.99', '18mp - f 2.2', '58mp -f 2.2 + 12mp - f 2.4 + 5mp - f 2.3', '8 octa core', 'v5.1', 'wi-fi 252', 'GSM 850/900/1800/1900 MHz', '2022-07-10 11:46:54', 182.24),
	(8, 1, 'novi samsung', 'opis artikla 2022', ' android', '6gb', '32gb', '2400x1800', '5.99', '18mp - f 2.2', '58mp -f 2.2 + 12mp - f 2.4 + 5mp - f 2.3', '8 octa core', 'v5.1', 'wi-fi 252', 'GSM 850/900/1800/1900 MHz', '2022-07-10 11:47:28', 182.24),
	(9, 1, 'novi samsung', 'opis artikla 2022', ' android', '6gb', '32gb', '2400x1800', '5.99', '18mp - f 2.2', '58mp -f 2.2 + 12mp - f 2.4 + 5mp - f 2.3', '8 octa core', 'v5.1', 'wi-fi 252', 'GSM 850/900/1800/1900 MHz', '2022-07-10 12:49:25', 182.24),
	(10, 1, 'novi samsung', 'opis artikla 2022', ' android', '6gb', '32gb', '2400x1800', '5.99', '18mp - f 2.2', '58mp -f 2.2 + 12mp - f 2.4 + 5mp - f 2.3', '8 octa core', 'v5.1', 'wi-fi 252', 'GSM 850/900/1800/1900 MHz', '2022-07-10 12:49:28', 182.24);

-- Dumping structure for table appmobtel.category
CREATE TABLE IF NOT EXISTS `category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  `image_path` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `uq_category_name` (`name`),
  UNIQUE KEY `uq_category_image_path` (`image_path`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table appmobtel.category: ~5 rows (approximately)
DELETE FROM `category`;
INSERT INTO `category` (`category_id`, `name`, `image_path`) VALUES
	(1, 'izmenjenA KATEGORIJABRE', 'nestotamo/ePoskat2R.png'),
	(18, 'aaaaaadodaato', 'nestotamo/ePoskat23.png'),
	(21, 'dodata nova kategorija kao admin', 'nestotamo/novakatkaoadmin.png'),
	(22, 'dodata nova kategorijaaaaaaaa kao admin', 'nestotamo/novakatkaaaaaaaaoadmin.png'),
	(23, 'dodata nova kategorijaaaaaaaa kao admin1', 'nestotamo/novakatkaaaaaaaaoadmin1.png'),
	(24, 'dodata nova kategorija kao admin2', 'nestotamo/novakatkaoadmin2.png'),
	(25, 'prva', 'asdadsa.jpg');

-- Dumping structure for table appmobtel.photo
CREATE TABLE IF NOT EXISTS `photo` (
  `photo_id` int unsigned NOT NULL AUTO_INCREMENT,
  `article_id` int unsigned NOT NULL,
  `image_path` varchar(128) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`photo_id`),
  UNIQUE KEY `uq_photo_image_path` (`image_path`),
  KEY `fk_photo_article_id` (`article_id`),
  CONSTRAINT `fk_photo_article_id` FOREIGN KEY (`article_id`) REFERENCES `article` (`article_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- Dumping data for table appmobtel.photo: ~3 rows (approximately)
DELETE FROM `photo`;
INSERT INTO `photo` (`photo_id`, `article_id`, `image_path`) VALUES
	(3, 4, 'static/uploads/2022/06/5e695277-4030-450d-8281-bde7543180a2-phones-switch-apps.jpg'),
	(4, 5, 'static/uploads/2022/06/fd2af953-1563-4a56-b724-1b9928110726-phones-switch-apps.jpg'),
	(5, 6, 'static/uploads/2022/06/e11c96a6-3861-4837-a466-797b26df04ec-phones-switch-apps.jpg'),
	(6, 7, 'static/uploads/2022/07/f9a78152-d3aa-4c47-8b7f-c5cb26781bc0-phones-switch-apps.jpg'),
	(7, 8, 'static/uploads/2022/07/ab374f6b-1d1b-44d5-abbd-e517b0524eec-phones-switch-apps.jpg'),
	(8, 9, 'static/uploads/2022/07/76074790-81c5-4b0b-be0a-9038202d30ab-phones-switch-apps.jpg'),
	(9, 10, 'static/uploads/2022/07/d0a63ecb-dcd0-48f3-b155-5b06847394a1-phones-switch-apps.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
