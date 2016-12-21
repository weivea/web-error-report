CREATE TABLE `err_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `url` longtext,
  `user_agent` longtext,
  `cookie` longtext,
  `err_data` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26187 DEFAULT CHARSET=utf8;