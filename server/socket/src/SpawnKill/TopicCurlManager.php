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

        $this->topics = array();

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

        $currentTopics = $this->getCurrentTopics();

        $toUpdateTopics = array();

        foreach ($currentTopics as $currentTopic) {

            //Si les données du topic ne sont pas à jour
            //et qu'aucune erreur n'est survenue, on marque le topic
            if(!$currentTopic->error && !$currentTopic->upToDate) {

                $toUpdateTopics[] = $currentTopic;
            }
        }

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

        return $currentTopics;
    }

    /**
     * Récupère les données de la dernière page connue des topics.
     * @return array<Topic> Topics contenant les données des dernières pages connues
     */
    private function getCurrentTopics() {

        $topics = array();

        //On reset le tableau d'urls
        $this->urls = array();

        //On peuple $this->urls avec les urls des dernières pages des topics
        foreach ($this->topics as $topic) {
            $topics[] = $topic;
            $this->urls[] = $topic->getPageUrl($topic->getPageCount());
        }

        //On récupère les infos des urls
        $requestsData = $this->processRequests();

        //On lie ces données aux topics correspondants
        for($i = 0; $i < count($requestsData); $i++) {

            $topicData = $this->parseTopicData($requestsData[$i]);

            $topics[$i]->setPageCount($topicData->pageCount);
            $topics[$i]->setLocked($topicData->locked);
            if(isset($topicData->postCount)) {
                $topics[$i]->setPostCount($topicData->postCount);
            }
            $topics[$i]->upToDate = $topicData->upToDate;
            $topics[$i]->error = $topicData->error;
        }

        return $topics;

    }

    /**
     * Extrait les infos d'un topic en fonction du html d'une page du topic
     * @return stdClass {
     *      error: (boolean) : true si une erreur a été rencontrée (statut HTTP >= 400)
     *      pageCount: (int)
     *      upToDate: (boolean) : true si la page récupérée est la dernière du topic
     *      postCount: (int) : Seulement présent si upToDate = true
     *      locked: (boolean)
     * }
     */
    private function parseTopicData($requestResult) {

        $topicData = new \stdClass();

        //Erreur
        $topicData->error = $requestResult->httpCode >= 400;

        if(!$topicData->error) {
            //Nombre de pages
            preg_match('/<count_page>(\\d*)<\\/count_page>/', $requestResult->data, $matches);
            if(!isset($matches[1])) {
                $topicData->error = true;
                return $topicData;
            }
            else {
                $topicData->pageCount = intval($matches[1]);
            }

            //À jour si la page récupérée est la dernière
            preg_match('/<num_page>(\\d*)<\\/num_page>/', $requestResult->data, $matches);
            if(!isset($matches[1])) {
                $topicData->error = true;
                return $topicData;
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
        }

        return $topicData;
    }


}