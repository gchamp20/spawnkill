<?php
namespace SpawnKill;
use SpawnKill\SocketMessage;

/**
 * Représente un topic de JVC
 */
class Topic implements \Serializable {

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
    protected $pageCount = 1;

    /**
     * Nombre de posts du topic à un instant T
     */
    protected $postCount = 1;

    /**
     * Vrai si le topic est locké.
     */
    protected $locked = false;

    /**
     * Vrai si des infos ont déjà été récupérées pour ce topic.
     */
    protected $dataFetched = false;

    //Attributs temporaires utilisés pour la récupération des données, à revoir.
    public $error = false;
    public $upToDate = false;


    public function __construct($id) {
        $this->id = $id;
        $this->followers = new \SplObjectStorage();
    }

    public function isLocked() {
        return $this->locked;
    }

    public function setLocked($locked) {
        $this->locked = $locked;
    }

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getFollowers() {
        return $this->followers;
    }

    public function addFollower($follower) {
        $this->followers->attach($follower);
        echo "[Topic '{$this->id}'] Nouveau follower : '{$follower->resourceId}'\n";
    }

    public function removeFollower($follower) {
        $this->followers->detach($follower);
        echo "[Topic '{$this->id}'] Follower déconnecté : '{$follower->resourceId}'\n";
    }

    public function setPostCount($postCount) {
        $this->postCount = $postCount;
    }

    public function setPageCount($pageCount) {
        $this->pageCount = $pageCount;
    }

    public function getPostCount() {
        return $this->postCount;
    }

    public function getPageCount() {
        return $this->pageCount;
    }

    public function getDataFetched() {
        return $this->dataFetched;
    }

    public function setDataFetched($dataFetched) {
        $this->dataFetched = $dataFetched;
    }

    /**
     * Retourne l'url de la page du topic passée en paramètre.
     */
    public function getPageUrl($pageNumber) {
        return 'http://ws.jeuxvideo.com/forums/1-' . $this->id . '-' . $pageNumber . '-0-1-0-0.xml';
    }

    /**
     * Retourne un objet contenant les infos de base
     * du topic.
     */
    public function getInfos() {

        $topicInfos = new \stdClass();
        $topicInfos->pageCount = $this->pageCount;
        $topicInfos->postCount = $this->postCount;
        $topicInfos->locked = $this->locked;

        return $topicInfos;
    }

    /**
     * Envoie les infos du topic à toutes les connexions qui suivent ce topic.
     */
    public function sendInfosToFollowers() {

        foreach ($this->followers as $follower) {
            $this->sendInfosTo($follower);
        }
    }

    /**
     * Envoie les infos du topic à une connexion en particulier.
     */
    public function sendInfosTo($follower) {
        $message = SocketMessage::fromData('topicInfos', $this->getInfos());
        $follower->send($message->toJson());
    }

    public function serialize() {

        return serialize(array(
            "id" => $this->id,
            "pageCount" => $this->pageCount,
            "postCount" => $this->postCount,
            "locked" => $this->locked
        ));
    }

    public function unserialize($serialized) {

        $data = unserialize($serialized);

        $this->id = $data["id"];
        $this->pageCount = $data["pageCount"];
        $this->postCount = $data["postCount"];
        $this->locked = $data["locked"];
    }
}