<?php

include "config.php";

header('Content-Type: text/html; charset=utf-8');

/**
 * Permet de requêter et de mettre en cache l'API de Github
 */
$action = $_GET['action'];

function curly($url) {

	global $dbh;

	//On calcule le timestamp des dernières données valides
	$now = time();
	$lastValidDataTimestamp = $now - (60); //1 minute
 
 	$stmt = $dbh->prepare("SELECT *
 		FROM api_cache_data
 		WHERE url = :url
 		AND timestamp > :timestamp
        LIMIT 1
 	");

    $stmt->bindValue(':url', $url);
    $stmt->bindValue(':timestamp', $lastValidDataTimestamp);

    $rows = $stmt->execute();

 	$cache_data = $rows->fetch(PDO::FETCH_ASSOC);

 	if(!empty($cache_data)) {
 		$output = $cache_data['data'];
 	}
 	else {
	    if (!function_exists('curl_init')){
	        die('Sorry cURL is not installed!');
	    }
	 
	    $ch = curl_init();
	 
	    curl_setopt($ch, CURLOPT_URL, $url);
	    curl_setopt($ch, CURLOPT_USERAGENT, "SpawnKill");
	    curl_setopt($ch, CURLOPT_HEADER, 0);
	    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	 
	    $output = curl_exec($ch);
	    curl_close($ch);

	    $dbh->query("INSERT INTO api_cache_data(url, data, timestamp)
	    	VALUES(" . $dbh->quote($url) . ", " . $dbh->quote($output) . ", $now)
	    	ON DUPLICATE KEY UPDATE
	    	    data = " . $dbh->quote($output) . ",
	    	    timestamp = $now
	    ");
 	}

    return $output;
}

$options = array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'); 
$dbh = new PDO("mysql:host=" . HOST . ";dbname=" . DATABASE . ";", LOGIN, PASS, $options);

switch($action) {

	//récupère les releases de SpawnKill
	case "releases" :

		$releases_url = 'https://api.github.com/repos/dorian-marchal/spawnkill/releases?client_id=' . GITHUB_CLIENT_ID . '&client_secret=' . GITHUB_CLIENT_SECRET;
		echo curly($releases_url);
		break;

}
