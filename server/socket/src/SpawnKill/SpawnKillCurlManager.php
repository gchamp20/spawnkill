<?php
namespace SpawnKill;

/**
 * Wrapper de CurlManager permettant de faire facilement des requêtes
 * parallèles vers l'API de JVC (avec login/pass déjà paramétrés).
 */
class SpawnKillCurlManager extends MultiCurlManager {

    protected $apiUsername = 'appandr';
    protected $apiPassword = 'e32!cdf';
    protected $timeoutMs = 1000;


    public function __construct() {

        parent::__construct();

        $this->setOptions(array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPAUTH => CURLAUTH_ANY,
            CURLOPT_TIMEOUT_MS => $this->timeoutMs,
            CURLOPT_USERPWD => $this->apiUsername . ':' . $this->apiPassword
        ));
    }
}