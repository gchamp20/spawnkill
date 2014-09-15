<?php
namespace SpawnKill;

class Log {
	public static function ln($string = "") {
		if(Config::$DEBUG === true) {
			echo $string . "\n";
		}
	}
}