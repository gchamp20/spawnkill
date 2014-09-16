<?php
namespace SpawnKill;

/**
 * Wrapper de CurlManager permettant de faire facilement des requêtes
 * parallèles vers l'API de JVC (avec login/pass déjà paramétrés).
 * Cette classe fille facilite la récupération des infos des topics.
 */
class TopicCurlManager extends SpawnKillCurlManager {

    /**
     * Topics dont on veut récupérer les infos
     */
    private $topics;

    public function __construct() {

        parent::__construct();

        $topics = array();

    }

    /**
     * Ajoute un topic à la liste des topics dont on veut les infos.
     */
    public function addTopic(Topic $topic) {
        $this->topics[] = $topic;
    }

    /**
     * Récupère les données de la dernière page connue des topics.
     * @return array Données du type Object(
     *      "topic" : Topic
     *      "data" : Object(
     *                  "httpCode" => (int),
     *                  "data" => (string)
     *              )
     *       )
     * )
     */
    public function getTopicsData() {

        $topicsData = array();

        //On reset le tabloeau d'urls
        $this->urls = array();

        //On peuple $this->urls avec les urls des dernières pages des topics
        foreach ($this->topics as $topic) {
            $lastPageData = new \stdClass();
            $lastPageData->topic = $topic;
            $topicsData[] = $lastPageData;

            $this->urls[] = $topic->getPageUrl($topic->getPageCount());
        }

        //On récupère les infos des urls
        $requestsData = $this->processRequests();

        //On lie ces données aux topics correspondants
        for($i = 0; $i < count($requestsData); $i++) {
            $topicsData[$i]->data = $requestsData[$i];
        }

        return $topicsData;

    }


}