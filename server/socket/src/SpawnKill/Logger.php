<?php
namespace SpawnKill;
use SpawnKill\ShellColors;

class Logger {

	private $tag;
	private $color;
	private $shellColors;

	public function __construct($tag, $color = null) {
		$this->tag = $tag;
		$this->shellColors = new ShellColors();
		$this->color = $color;
		date_default_timezone_set('UTC');
	}

	//Log standard
	public function ln($string = '', $logLevel = 1) {

		if(Config::$LOG_LEVEL >= $logLevel) {
			$now = new \DateTime();
			$now->modify('+2 hours');

			$tag = '[' . $now->format('d-m H:i:s') . ' ' . $this->tag . '] ';

			if(Config::$COLOR_SHELL === true) {
				$tag = $this->shellColors->getColoredString($tag, $this->color);
			}

			echo $tag . $string . "\n";
		}
	}
}