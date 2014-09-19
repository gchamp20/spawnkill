<?php
namespace SpawnKill;

class Logger {

	private $tag;

	public function __construct($tag) {
		$this->tag = $tag;
	}

	public function ln($string = "") {
		if(Config::$DEBUG === true) {
			echo '[' . $this->tag . '] ' . $string . "\n";
		}
	}
}