<?php
namespace SpawnKill;
use SpawnKill\ShellColors;

/**
 * Classe de log
 * À revoir, les niveaux de logs doivent être mieux définis.
 */
class Logger {

	private $tag;
	private $color;
	private $shellColors;

	/**
	 * Si vrai, le logger n'émet aucun message
	 */
	private $mute;

	public function __construct($tag, $color = null, $mute = false) {
		$this->tag = $tag;
		$this->shellColors = new ShellColors();
		$this->color = $color;
		$this->mute = $mute;
		date_default_timezone_set('Europe/Paris');
	}

	/**
	 * Méthode de log standard
	 * $logLevel
	 * 	1 : logs principaux
	 *  2 : logs secondaires
	 *  3 : logs verbeux
	 *  -1: erreur
	 */
	public function ln($string = '', $logLevel = 1) {

		if(Config::$LOG_LEVEL >= $logLevel && !$this->mute) {
			$now = new \DateTime();

			$tag = '[' . $now->format('d-m H:i:s') . ' ' . $this->tag . '] ';

			if($logLevel === -1) {
				$color = "red";
			}
			else {
				$color = $this->color;
			}

			if(Config::$COLOR_SHELL === true) {
				$tag = $this->shellColors->getColoredString($tag, $color);
			}

			echo $tag . $string . "\n";
		}
	}
}
