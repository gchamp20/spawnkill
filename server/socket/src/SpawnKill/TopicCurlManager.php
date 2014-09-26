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

    private $logger;

    public function __construct() {

        parent::__construct();

        $this->topics = array();
        $this->logger = new Logger("curl", "brown", false);

    }

    /**
     * Ajoute un topic à la liste des topics dont on veut les infos.
     */
    public function addTopic(Topic $topic) {
        $this->topics[] = $topic;
    }

    /**
     * Supprime tous les topics
     */
    public function clearTopics() {
        $this->topics = array();
    }


    /**
     * Récupère les données des topics.
     * @return array<Topic> Topics mis à jour
     */
    public function getUpdatedTopics() {

        $this->logger->ln("@getUpdatedTopics...", 3);

        $currentTopics = $this->getCurrentTopics();

        $toUpdateTopics = array();

        foreach ($currentTopics as $currentTopic) {

            //Si le topic n'est pas à jour (la page récupérée n'est pas la dernière)
            //et qu'aucune erreur n'est survenue, on marque le topic
            if(!$currentTopic->error && !$currentTopic->upToDate) {

                $toUpdateTopics[] = $currentTopic;
            }
        }

        $this->logger->ln('$toUpdateTopics: ' . print_r($toUpdateTopics, true), 3);

        //On prépare les topics à mettre à jour
        $this->clearTopics();

        foreach ($toUpdateTopics as $topic) {
            $this->addTopic($topic);
        }

        //On récupère les infos à jour
        $updatedTopics = $this->getCurrentTopics();

        //On complète les données avec la mise à jour (et on met à jour les topics)
        foreach ($currentTopics as &$currentTopic) {

            if(!$currentTopic->error && !$currentTopic->upToDate) {

                //On remplace les anciennes données
                $currentTopic = array_shift($updatedTopics);
            }
        }
        unset($currentTopic);

        $this->logger->ln('$updatedTopics: ' . print_r($currentTopics, true), 3);
        return $currentTopics;
    }

    /**
     * Récupère les données de la dernière page connue des topics.
     * @return array<Topic> Topics contenant les données des dernières pages connues
     */
    private function getCurrentTopics() {

        $this->logger->ln("@getCurrentTopics...", 3);
        $topics = array();

        //On reset le tableau d'urls
        $this->urls = array();

        $this->logger->ln('Mise a jour des urls a recuperer...', 3);
        //On peuple $this->urls avec les urls des dernières pages des topics
        foreach ($this->topics as $topic) {
            $topics[] = $topic;
            $this->urls[] = $topic->getPageUrl($topic->getPageCount());
        }
        $this->logger->ln('$urls: ' . print_r($this->urls, true), 3);


        //On récupère les infos des urls
        $this->logger->ln('Requetes HTTP...', 3);
        $requestsData = $this->processRequests();


        $this->logger->ln(count($requestsData) . ' donnees de topic recuperees...', 3);

        //On lie ces données aux topics correspondants
        for($i = 0; $i < count($requestsData); $i++) {

            $topicData = $this->parseTopicData($requestsData[$i]);
            $this->logger->ln('Donnee ' . ($i + 1) . ': ' . print_r($topicData, true), 3);

            //En cas d'erreur, on n'enregistre aucune donnée et on marque le topic en "erreur"
            if($topicData === false) {
                $topics[$i]->error = true;
            }
            else {

                $topics[$i]->setPageCount($topicData->pageCount);
                $topics[$i]->setLocked($topicData->locked);
                if(isset($topicData->postCount)) {
                    $topics[$i]->setPostCount($topicData->postCount);
                }
                $topics[$i]->upToDate = $topicData->upToDate;
            }
        }

        $this->logger->ln('$currentTopics: ' . print_r($topics, true), 3);
        return $topics;

    }

    /**
     * Extrait les infos d'un topic en fonction du html d'une page du topic
     * @return stdClass {
     *      pageCount: (int)
     *      upToDate: (boolean) : true si la page récupérée est la dernière du topic
     *      postCount: (int) : Seulement présent si upToDate = true
     *      locked: (boolean)
     * }
     * ou false si une erreur a été rencontrée  (statut HTTP >= 400)
     */
    private function parseTopicData($requestResult) {

        $topicData = new \stdClass();

        //Erreur
        if($requestResult->httpCode >= 400) {
            return false;
        }

        //Nombre de pages
        preg_match('/<count_page>(\\d*)<\\/count_page>/', $requestResult->data, $matches);
        if(!isset($matches[1])) {
            return false;
        }
        else {
            $topicData->pageCount = intval($matches[1]);
        }

        //À jour si la page récupérée est la dernière
        preg_match('/<num_page>(\\d*)<\\/num_page>/', $requestResult->data, $matches);
        if(!isset($matches[1])) {
            return false;
        }
        else {
            $currentPageNumber = intval($matches[1]);
            $topicData->upToDate = $currentPageNumber === $topicData->pageCount;
        }

        //Locké si le lien de réponse n'est pas présent
        preg_match('/<repondre>/', $requestResult->data, $matches);
        $topicData->locked = empty($matches);

        //Nombre de posts
        if($topicData->upToDate) {
            preg_match_all('/<b class=\\"cdv\\">/', $requestResult->data, $matches);
            $currentPagePostCount = intval(count($matches[0]));
            $topicData->postCount = (($topicData->pageCount - 1) * 20) + $currentPagePostCount;
        }

        return $topicData;
    }


}