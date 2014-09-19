<?php
namespace SpawnKill;

class Logger {

	private $tag;

	public function __construct($tag) {
		$this->tag = $tag;
	}

	//Log standard
	public function ln($string = "") {
		echo '[' . $this->tag . '] ' . $string . "\n";
	}

	//Affiché seulement en mode debug
	public function dg($string = "") {
		if(Config::$DEBUG === true) {
			echo '[' . $this->tag . '] ' . $string . "\n";
		}
	}
}