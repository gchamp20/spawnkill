<?php
include "config.php";

try {
	$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'); 
	$dbh = new PDO("mysql:host=" . HOST . ";", LOGIN, PASS, $options);

	$dbh->query('
		CREATE DATABASE `' . DATABASE . '` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
		USE `' . DATABASE . '`;

		CREATE TABLE IF NOT EXISTS `api_cache_data` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `url` varchar(300) NOT NULL,
		  `data` blob NOT NULL,
		  `timestamp` int(11) NOT NULL,
		  PRIMARY KEY (`id`),
		  UNIQUE KEY `url` (`url`)
		) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;

		CREATE TABLE IF NOT EXISTS `api_calls` (
		  `id` int(11) NOT NULL AUTO_INCREMENT,
		  `ip` varchar(16) NOT NULL,
		  `action` varchar(20) NOT NULL,
		  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
		  PRIMARY KEY (`id`),
		  KEY `ip` (`ip`)
		) ENGINE=MyISAM  DEFAULT CHARSET=utf8 ;
	');

}
catch (Exception $e) {
	echo $e->getMessage();
}

	


