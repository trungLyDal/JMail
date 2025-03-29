-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2025 at 04:52 PM
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
(10, 1, 3, 'Re: Information', 'Thank you for the information.', '2025-03-28 14:32:21');

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
('81d852947184318f82a23a32e946e873ece1ca87c7ec8e7955a57455244d8df7fda24bd3d2d10d06a360ca00f36f660d39e6dd08cdebf3b71d6ebd9a57c08811', 3, 1743263547100);

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
(1, 'newuser@gmail.com', '2025-03-28 18:50:57'),
(2, 'newuser1@gmail.com', '2025-03-28 17:27:36'),
(3, 'newuser2@gmail.com', '2025-03-28 18:52:27');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
