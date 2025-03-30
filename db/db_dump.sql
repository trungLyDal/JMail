-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2025 at 08:33 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `a4`
--

-- --------------------------------------------------------

--
-- Table structure for table `emails`
--

CREATE TABLE `emails` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emails`
--

INSERT INTO `emails` (`id`, `sender_id`, `recipient_id`, `subject`, `body`, `created_at`) VALUES
(1, 1, 2, 'Hello from User 1', 'This is the first email from user 1 to user 2.', '2025-03-28 14:32:21'),
(2, 2, 1, 'Re: Hello from User 1', 'This is a reply from user 2 to user 1.', '2025-03-28 14:32:21'),
(3, 1, 3, 'Meeting Invitation', 'You are invited to a meeting on Friday.', '2025-03-28 14:32:21'),
(4, 3, 1, 'Re: Meeting Invitation', 'I will be there.', '2025-03-28 14:32:21'),
(5, 2, 3, 'Project Update', 'Here is the latest project update.', '2025-03-28 14:32:21'),
(6, 3, 2, 'Re: Project Update', 'Thanks for the update.', '2025-03-28 14:32:21'),
(7, 1, 2, 'Urgent Request', 'Please review this document ASAP.', '2025-03-28 14:32:21'),
(8, 2, 1, 'Re: Urgent Request', 'I have reviewed the document.', '2025-03-28 14:32:21'),
(9, 3, 1, 'Information', 'Here is some information for you.', '2025-03-28 14:32:21'),
(10, 1, 3, 'Re: Information', 'Thank you for the information.', '2025-03-28 14:32:21'),
(11, 1, 2, 'Test1', 'TestMessage', '2025-03-29 17:22:54'),
(12, 1, 3, 'Test2', 'WOWOWOW', '2025-03-29 17:25:42'),
(13, 1, 2, 'Whast up', 'Test3', '2025-03-29 17:38:57'),
(14, 1, 2, 'testets', 'WAP', '2025-03-29 18:30:06'),
(15, 1, 2, 'finalTest', 'ssssssssss', '2025-03-29 18:37:52'),
(16, 1, 2, 'finalTest2', 'ssss', '2025-03-29 18:40:07'),
(17, 1, 2, 'finalTest2222', 'ggggg', '2025-03-29 18:41:16'),
(18, 1, 2, 'finalTest2222ssss', 'hellloo', '2025-03-29 18:41:35');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`id`, `user_id`, `email`, `password`) VALUES
(1, 1, 'newuser@gmail.com', '$2b$10$ZqdImw/MJONrKVvGhRAfsOVVxzTcvbb5jlLfdiQD7ExKMdBkp24tO'),
(2, 2, 'newuser1@gmail.com', '$2b$10$TLkqz/2SK8b3jybDPdBkGOOU218UAXBDFu3UDLdUbnD1LVV9Au6yi'),
(3, 3, 'newuser2@gmail.com', '$2b$10$tVdyaHTxSXzB3lG9dyy44OdbAx8QKKxZje.I7WTmMPLRmcdP.EHoG');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `expires` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `user_id`, `expires`) VALUES
('3e4e68de320a43fe959d5481be0c852d5481bbec16c347d36bd5a75df58d0e05d6b2bb953fdfed6bca3303bdb396dc4045bad637935200bb8f59e639e8d580d0', 2, 1743445154833),
('4f48942fb4a33cbb3ca814c30566caff1c085641542ecb3e0b56ef9f7c31ea08342296f2ede5b903e3b1dd5b7378dacac7a28dccc692152646a8a9b300219d2b', 1, 1743346194120),
('81d852947184318f82a23a32e946e873ece1ca87c7ec8e7955a57455244d8df7fda24bd3d2d10d06a360ca00f36f660d39e6dd08cdebf3b71d6ebd9a57c08811', 3, 1743263547100),
('91568cf21236ee867e91083e076287b05ab18d588597818ecd8ddb3de5da44d376994a1b9c1fcdc9fa35662011aa914dbe4970d2918e6128d858f1a681a33273', 1, 1743359826780),
('9b57431e7b1ac8ed5f33671fbb90b3ba02b8f7d14d7dc376368e874534974553c4064a27646e49e2e1cdfffd2a954b7e976fa9b7bd3bd02036e03fe68f2f9c2f', 1, 1743355280745),
('b24080dfb84e4bb2ee523fdcfab25818e97eef95a8a5a6371d5ccf0ce39b6741e60d1f0b606e19ae929d298f8d89f695d6f80da02bd78367f98c462639ff2793', 1, 1743345166031),
('c8ac79dc1a1c3f9f79754bb6f7de591df6f19bc425c9764244250f325b1215f74b6e452d5aa6fc6bf4e59d40343d3c5dd4dea2346154504aefbbcf7924a71718', 1, 1743346164119),
('d92bd5c00c1bd4d1a5297d3362124e024bb2b7fa0d6ca59c8b813ab64a1c82c8da396077a6a73e34b5ac03f980ed59519e0f0fab42169a42abcb5beb62711167', 1, 1743354785368);

-- --------------------------------------------------------

--
-- Table structure for table `user_info`
--

CREATE TABLE `user_info` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_info`
--

INSERT INTO `user_info` (`user_id`, `email`, `last_login`) VALUES
(1, 'newuser@gmail.com', '2025-03-29 21:39:51'),
(2, 'newuser1@gmail.com', '2025-03-30 21:19:14'),
(3, 'newuser2@gmail.com', '2025-03-29 20:25:53');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `emails`
--
ALTER TABLE `emails`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `recipient_id` (`recipient_id`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `emails`
--
ALTER TABLE `emails`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_info`
--
ALTER TABLE `user_info`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `emails`
--
ALTER TABLE `emails`
  ADD CONSTRAINT `emails_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `user_info` (`user_id`),
  ADD CONSTRAINT `emails_ibfk_2` FOREIGN KEY (`recipient_id`) REFERENCES `user_info` (`user_id`);

--
-- Constraints for table `login`
--
ALTER TABLE `login`
  ADD CONSTRAINT `login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`);

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_info` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
