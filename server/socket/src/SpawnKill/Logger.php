<?php
namespace SpawnKill;

class Logger {

	private $tag;

	public function __construct($tag) {
		$this->tag = $tag;
		date_default_timezone_set('UTC');
	}

	//Log standard
	public function ln($string = '') {
		$now = new \DateTime();
		$now->modify('+2 hours');
		echo '[' . $now->format('d-m H:i:s') . ' ' . $this->tag . '] ' . $string . "\n";
	}

	//Affiché seulement en mode debug
	public function dg($string = '') {
		if(Config::$DEBUG === true) {
			echo '[' . $this->tag . '] ' . $string . "\n";
		}
	}
}