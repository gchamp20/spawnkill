<?php
namespace SpawnKill;
use SpawnKill\SocketMessage;

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
    protected $followers;

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
        $this->followers = new \SplObjectStorage();
    }

    public function getId() {
        return $this->id;
    }

    public function getFollowers() {
        return $this->followers;
    }

    public function addFollower($follower) {
        $this->followers->attach($follower);
    }

    public function removeFollower($follower) {
        $this->followers->detach($follower);
    }

    public function setPostCount($postCount) {
        $this->postCount = $postCount;
    }

    public function setPageCount($pageCount) {
        $this->pageCount = $pageCount;
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
    public function getInfos() {
        return array(
            'pageCount' => $this->pageCount,
            'postCount' => $this->postCount
        );
    }

    /**
     * Envoie les infos du topic à toutes les connexions qui suivent ce topic.
     */
    public function sendInfosToFollowers() {

        foreach ($this->followers as $follower) {
            $follower->send(json_encode($this->getInfos()));
        }
    }
}