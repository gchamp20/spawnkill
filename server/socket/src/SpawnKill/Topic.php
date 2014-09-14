<?php
namespace SpawnKill;

/**
 * Représente un topic de JVC
 */
class Topic {

    /**
     * String id du topic de la forme "forum-topic"
     */
    protected $id;

    /**
     * Utilisateurs suivant le topic
     */
    protected $followers = array();

    /**
     * Nombre de pages du topic à un instant T
     */
    protected $pageCount = 0;

    /**
     * Nombre de posts du topic à un instant T
     */
    protected $postCount = 0;

    public function __construct($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function getFollowers() {
        return $this->followers;
    }

    /**
     * Retourne l'url de la page du topic passée en paramètre.
     */
    public function getPageUrl($pageNumber) {
        return 'http://ws.jeuxvideo.com/forums/1-' . $this->id . '-' . $pageNumber . '-0-1-0-0';
    }

    /**
     * Retourne un tableau associatif contenant les infos de base
     * du topic.
     */
    public function getTopicInfos() {
        return array(
            'pageCount' => $this->pageCount,
            'postCount' => $this->postCount
        );
    }
}