CREATE DATABASE  IF NOT EXISTS `elderly_health_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `elderly_health_db`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: elderly_health_db
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `message_type` enum('user','assistant') COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_chat_messages_id` (`id`),
  KEY `ix_chat_messages_timestamp` (`timestamp`),
  KEY `ix_chat_messages_session_id` (`session_id`),
  CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `chat_sessions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_messages`
--

LOCK TABLES `chat_messages` WRITE;
/*!40000 ALTER TABLE `chat_messages` DISABLE KEYS */;
INSERT INTO `chat_messages` VALUES (1,2,'user','xin chào','2025-06-06 12:34:13'),(2,2,'assistant','Chào bạn! Tôi ở đây để hỗ trợ bạn về các câu hỏi sức khỏe. Hãy cho tôi biết bạn muốn tìm hiểu về điều gì?','2025-06-06 12:34:13'),(3,2,'user','tôi bị đau họng','2025-06-06 12:34:20'),(4,2,'assistant','Chào bác/cô! Cháu rất tiếc khi nghe bác/cô bị đau họng.\n\n*   **Để giảm đau họng tạm thời, bác/cô có thể thử:**\n    *   Uống nhiều nước ấm (như trà gừng, nước chanh ấm pha mật ong).\n    *   Súc họng bằng nước muối ấm (1/4 thìa cà phê muối trong 1 cốc nước ấm).\n    *   Ngậm kẹo ngậm ho hoặc viên ngậm giảm đau họng.\n*   **Nên tránh:**\n    *   Đồ uống lạnh hoặc có ga.\n    *   Thức ăn cay nóng hoặc cứng, khó nuốt.\n    *   Khói thuốc lá và môi trường ô nhiễm.\n\nNếu tình trạng đau họng kéo dài hơn 3 ngày, hoặc kèm theo sốt cao, khó thở, khó nuốt, nổi hạch ở cổ, bác/cô nên đi khám bác sĩ để được chẩn đoán và điều trị kịp thời nhé ạ. Cháu không thể chẩn đoán bệnh hay kê đơn thuốc được ạ.\n\nTrong trường hợp khó thở, hãy gọi ngay 115 hoặc đến bệnh viện gần nhất! Chúc bác/cô mau khỏe ạ!','2025-06-06 12:34:24'),(5,2,'user','tôi bị viêm da thì nên dùng thuốc gì','2025-06-06 17:48:05'),(6,2,'assistant','Chào bác Dương ạ! ?\n\nCháu là trợ lý AI về sức khỏe, rất vui được hỗ trợ bác. Cháu hiểu bác đang lo lắng về tình trạng viêm da. Tuy nhiên, cháu không thể chẩn đoán bệnh hay kê đơn thuốc cho bác được. ⚠️ Việc này cần bác sĩ trực tiếp thăm khám và đưa ra chỉ định phù hợp.\n\n**Lời khuyên của cháu dành cho bác:**\n\n1.  **? Đến gặp bác sĩ da liễu:** Đây là bước quan trọng nhất. Bác sĩ sẽ xác định chính xác nguyên nhân gây viêm da (ví dụ: dị ứng, nhiễm trùng, chàm...) và kê đơn thuốc (thuốc bôi, thuốc uống...) phù hợp với tình trạng của bác.\n2.  **? Chăm sóc da nhẹ nhàng:**\n    *   Sử dụng sữa rửa mặt dịu nhẹ, không chứa hương liệu hoặc hóa chất mạnh.\n    *   Sau khi rửa mặt, nhẹ nhàng thấm khô da bằng khăn mềm.\n    *   Thoa kem dưỡng ẩm không gây kích ứng để giữ cho da không bị khô.\n3.  **? Tránh các tác nhân gây kích ứng:**\n    *   Hạn chế tiếp xúc với các chất tẩy rửa mạnh, xà phòng có tính kiềm cao.\n    *   Mặc quần áo rộng rãi, thoáng mát, làm từ chất liệu cotton.\n    *   Tránh gãi, chà xát vùng da bị viêm.\n    *   Nếu biết mình bị dị ứng với chất gì, hãy tránh tiếp xúc với chất đó.\n4.  **? TUYỆT ĐỐI KHÔNG tự ý dùng thuốc:** Việc tự ý mua thuốc bôi hoặc uống có thể làm tình trạng viêm da trở nên nghiêm trọng hơn.\n\n**Lưu ý quan trọng:**\n\n*   Nếu bác cảm thấy khó chịu, ngứa ngáy nhiều hoặc tình trạng viêm da lan rộng, hãy đến gặp bác sĩ ngay lập tức.\n*   Nếu bác có bất kỳ thắc mắc nào về các loại thuốc hoặc phương pháp điều trị, hãy hỏi ý kiến bác sĩ.\n\nChúc bác mau khỏe! ? Cháu luôn sẵn sàng hỗ trợ bác trong những vấn đề sức khỏe khác.','2025-06-06 17:48:09'),(7,2,'user','Tôi muốn điều trị bệnh cảm cúm thì như nào ','2025-06-06 19:15:16'),(8,2,'assistant','Chào bạn Dương! ? Cháu là trợ lý AI sức khỏe, rất vui được hỗ trợ bạn.\n\n? Cháu hiểu là bạn đang muốn tìm cách điều trị bệnh cảm cúm. Tuy nhiên, vì cháu không phải là bác sĩ và không có thông tin về tình trạng sức khỏe cụ thể của bạn, cháu xin phép đưa ra một số lời khuyên chung để bạn tham khảo, đồng thời khuyến khích bạn nên đi khám bác sĩ để được tư vấn và điều trị tốt nhất nhé.\n\n**1. Các biện pháp hỗ trợ điều trị cảm cúm tại nhà:**\n\n*   **Nghỉ ngơi đầy đủ:** Giấc ngủ rất quan trọng để cơ thể hồi phục. Hãy cố gắng ngủ đủ 7-8 tiếng mỗi đêm.\n*   **Uống nhiều nước:** Uống nước lọc, nước trái cây, súp gà... giúp làm loãng dịch nhầy và giảm nghẹt mũi. ?\n*   **Súc họng bằng nước muối ấm:** Giúp giảm đau họng và làm sạch cổ họng.\n*   **Xông hơi:** Xông hơi với tinh dầu (như bạc hà, khuynh diệp) có thể giúp thông mũi.\n*   **Ăn uống đầy đủ chất dinh dưỡng:** Tăng cường rau xanh, trái cây để bổ sung vitamin và khoáng chất. ?\n*   **Sử dụng thuốc không kê đơn (nếu cần):** Bạn có thể sử dụng các loại thuốc giảm đau, hạ sốt (như paracetamol), thuốc thông mũi... Tuy nhiên, hãy đọc kỹ hướng dẫn sử dụng và tuân thủ liều lượng khuyến cáo. ?\n\n**2. Lời khuyên quan trọng:**\n\n⚠️ **Nếu bạn có các triệu chứng sau, hãy đến gặp bác sĩ ngay lập tức:**\n\n*   Sốt cao (trên 39 độ C) kéo dài.\n*   Khó thở, đau ngực.\n*   Đau đầu dữ dội.\n*   Chóng mặt, mất ý thức.\n*   Các triệu chứng không cải thiện sau vài ngày.\n\n**3. Lưu ý:**\n\n*   **Không tự ý sử dụng kháng sinh:** Kháng sinh không có tác dụng đối với virus gây cảm cúm. Việc sử dụng kháng sinh không đúng cách có thể gây ra tác dụng phụ và làm tăng nguy cơ kháng kháng sinh.\n*   **Tránh tiếp xúc với người khác:** Để tránh lây lan bệnh cho người khác, hãy hạn chế tiếp xúc với người xung quanh, đặc biệt là người già và trẻ em.\n*   **Rửa tay thường xuyên:** Rửa tay bằng xà phòng và nước sạch là một biện pháp phòng ngừa hiệu quả.\n\n? **Nếu bạn cảm thấy tình trạng của mình nghiêm trọng, hãy gọi 115 hoặc đến bệnh viện gần nhất để được cấp cứu kịp thời.**\n\nChúc bạn mau khỏe! ?','2025-06-06 19:15:21');
/*!40000 ALTER TABLE `chat_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_sessions`
--

DROP TABLE IF EXISTS `chat_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `session_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ended_at` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_chat_sessions_user_id` (`user_id`),
  KEY `ix_chat_sessions_id` (`id`),
  KEY `ix_chat_sessions_session_id` (`session_id`),
  CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_sessions`
--

LOCK TABLES `chat_sessions` WRITE;
/*!40000 ALTER TABLE `chat_sessions` DISABLE KEYS */;
INSERT INTO `chat_sessions` VALUES (1,1,'790c357a-4e00-4db4-8e64-cb632899b687','2025-06-06 12:34:09','2025-06-06 12:34:09',0),(2,1,'2ec98383-5057-4601-bf5c-a1159c7db4c4','2025-06-06 12:34:09',NULL,1);
/*!40000 ALTER TABLE `chat_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_profiles`
--

DROP TABLE IF EXISTS `health_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `blood_type` enum('A_POSITIVE','A_NEGATIVE','B_POSITIVE','B_NEGATIVE','AB_POSITIVE','AB_NEGATIVE','O_POSITIVE','O_NEGATIVE') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chronic_diseases` text COLLATE utf8mb4_unicode_ci,
  `allergies` text COLLATE utf8mb4_unicode_ci,
  `current_medications` text COLLATE utf8mb4_unicode_ci,
  `medical_notes` text COLLATE utf8mb4_unicode_ci,
  `doctor_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `insurance_info` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_health_profiles_id` (`id`),
  CONSTRAINT `health_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_profiles`
--

LOCK TABLES `health_profiles` WRITE;
/*!40000 ALTER TABLE `health_profiles` DISABLE KEYS */;
INSERT INTO `health_profiles` VALUES (1,1,171.00,'O_POSITIVE','[]','[]','[]',NULL,NULL,NULL,NULL,'2025-06-06 19:10:23','2025-06-06 19:15:48');
/*!40000 ALTER TABLE `health_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_records`
--

DROP TABLE IF EXISTS `health_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `record_type` enum('blood_pressure','heart_rate','blood_sugar','weight','temperature') COLLATE utf8mb4_unicode_ci NOT NULL,
  `systolic_pressure` int DEFAULT NULL,
  `diastolic_pressure` int DEFAULT NULL,
  `heart_rate` int DEFAULT NULL,
  `blood_sugar` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `temperature` decimal(4,2) DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `recorded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_health_records_id` (`id`),
  KEY `ix_health_records_record_type` (`record_type`),
  KEY `ix_health_records_user_id` (`user_id`),
  CONSTRAINT `health_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_records`
--

LOCK TABLES `health_records` WRITE;
/*!40000 ALTER TABLE `health_records` DISABLE KEYS */;
INSERT INTO `health_records` VALUES (3,1,'blood_sugar',NULL,NULL,NULL,200.00,NULL,NULL,NULL,'2025-06-06 11:44:00','2025-06-06 18:44:28'),(4,1,'blood_pressure',100,90,NULL,NULL,NULL,NULL,NULL,'2025-06-06 11:44:00','2025-06-06 18:44:36'),(5,1,'heart_rate',NULL,NULL,80,NULL,NULL,NULL,NULL,'2025-06-06 11:44:00','2025-06-06 18:44:47'),(6,1,'weight',NULL,NULL,NULL,NULL,65.00,NULL,NULL,'2025-06-06 19:13:00','2025-06-06 19:13:39'),(7,1,'blood_pressure',110,100,NULL,NULL,NULL,NULL,NULL,'2025-06-06 19:13:00','2025-06-06 19:13:49');
/*!40000 ALTER TABLE `health_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medications`
--

DROP TABLE IF EXISTS `medications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `medication_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dosage` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `frequency` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `instructions` text COLLATE utf8mb4_unicode_ci,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_medications_id` (`id`),
  KEY `ix_medications_user_id` (`user_id`),
  CONSTRAINT `medications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medications`
--

LOCK TABLES `medications` WRITE;
/*!40000 ALTER TABLE `medications` DISABLE KEYS */;
INSERT INTO `medications` VALUES (1,1,'panodol12','500mg','2 lần/ngày','sau bữa ăn','2025-06-08','2025-06-18',1,'2025-06-06 18:47:23','2025-06-06 18:48:51'),(2,1,'sad','213','1 lần/ngày','123','2025-06-07','2025-06-26',0,'2025-06-06 18:48:16','2025-06-06 18:48:27'),(3,1,'Kháng sinh','500','2 lần/ngày','sau ăn','2025-06-08','2025-06-10',1,'2025-06-06 19:14:09','2025-06-06 19:14:09');
/*!40000 ALTER TABLE `medications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reminders`
--

DROP TABLE IF EXISTS `reminders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reminders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `schedule_id` int DEFAULT NULL,
  `reminder_type` enum('medication','appointment','checkup','custom') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci,
  `remind_datetime` datetime NOT NULL,
  `is_sent` tinyint(1) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  KEY `ix_reminders_remind_datetime` (`remind_datetime`),
  KEY `ix_reminders_user_id` (`user_id`),
  KEY `ix_reminders_is_sent` (`is_sent`),
  KEY `ix_reminders_id` (`id`),
  CONSTRAINT `reminders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reminders_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reminders`
--

LOCK TABLES `reminders` WRITE;
/*!40000 ALTER TABLE `reminders` DISABLE KEYS */;
INSERT INTO `reminders` VALUES (1,1,2,'appointment','Nhắc nhở: Test Schedule','Bạn có Test Schedule vào lúc 12:31','2025-06-12 12:01:00',0,0,'2025-06-06 18:53:36'),(2,1,3,'appointment','Nhắc nhở: Khám lần 1 ','Bạn có Khám lần 1  vào lúc 08:00','2025-06-08 07:30:00',0,0,'2025-06-06 19:14:56');
/*!40000 ALTER TABLE `reminders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `schedule_type` enum('medication','appointment','checkup') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `scheduled_datetime` datetime NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `doctor_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `medication_id` int DEFAULT NULL,
  `is_completed` tinyint(1) DEFAULT NULL,
  `is_recurring` tinyint(1) DEFAULT NULL,
  `recurrence_pattern` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medication_id` (`medication_id`),
  KEY `ix_schedules_id` (`id`),
  KEY `ix_schedules_user_id` (`user_id`),
  KEY `ix_schedules_scheduled_datetime` (`scheduled_datetime`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`medication_id`) REFERENCES `medications` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,'appointment','khámmm','123','2025-06-03 02:13:00','123','123',NULL,0,0,NULL,'2025-06-06 18:52:19','2025-06-06 18:52:44'),(2,1,'appointment','Test Schedule','Test description','2025-06-12 12:31:00','Test location','Dr. Test',NULL,0,0,NULL,'2025-06-06 18:53:36','2025-06-06 18:53:36'),(3,1,'appointment','Khám lần 1 ',NULL,'2025-06-08 08:00:00','Bệnh viện Bạch Mai','Nguyễn Văn B',NULL,0,0,NULL,'2025-06-06 19:14:56','2025-06-06 19:14:56');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_settings`
--

DROP TABLE IF EXISTS `user_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `ix_user_settings_user_id` (`user_id`),
  KEY `ix_user_settings_id` (`id`),
  CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_settings`
--

LOCK TABLES `user_settings` WRITE;
/*!40000 ALTER TABLE `user_settings` DISABLE KEYS */;
INSERT INTO `user_settings` VALUES (1,1,'notifications.email','true','2025-06-06 19:10:38','2025-06-06 19:10:38'),(2,1,'notifications.push','true','2025-06-06 19:10:39','2025-06-06 19:10:39'),(3,1,'notifications.sms','true','2025-06-06 19:10:40','2025-06-06 19:10:40'),(4,1,'display.fontSize','small','2025-06-06 19:10:44','2025-06-06 19:10:44'),(5,1,'display.theme','dark','2025-06-06 19:10:46','2025-06-06 19:10:51'),(6,1,'display.language','vi','2025-06-06 19:10:46','2025-06-06 19:10:46'),(7,1,'privacy.shareData','false','2025-06-06 19:10:46','2025-06-06 19:10:46'),(8,1,'privacy.analytics','false','2025-06-06 19:10:46','2025-06-06 19:10:46'),(9,1,'reminders.advanceMinutes','30','2025-06-06 19:10:46','2025-06-06 19:10:46'),(10,1,'reminders.sound','false','2025-06-06 19:10:46','2025-06-06 19:10:46');
/*!40000 ALTER TABLE `user_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `emergency_contact_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `emergency_contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'duong@gmail.com','$2b$12$r7qEPdHI/mzptgoB83.d..zfBdjP4.8izqFqxqGTX7LwHDVIFRTB6','0367805247','Nguyễn Hải Dương','2002-03-27','male','Hà Nội',NULL,NULL,'2025-06-06 12:05:53','2025-06-06 19:15:40',1,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-07  2:38:48
