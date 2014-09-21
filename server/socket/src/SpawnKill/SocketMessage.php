<?php
namespace SpawnKill;

/**
 * Message envoyé via les websockets
 */
class SocketMessage {

    /**
     * @var String Identifiant du message
     */
    protected $id;

    /**
     * @var StdClass Données du message
     */
    protected $data;

    public function __construct() {
    }

    /**
     * Retourne un message à partir d'une chaîne json
     * @param String $json du type {id:{my:data}}
     */
    public static function fromJson($json) {
        $message = new SocketMessage();
        $data = json_decode($json);

        if($data === null ||
            !is_object($data) ||
            key($data) === null ||
            current($data) === false
        ) {
            return false;
        }

        $message->setId(key($data));
        $message->setData(current($data));
        return $message;
    }

    public static function fromData($id, $data) {
        $message = new SocketMessage();
        $message->setId($id);
        $message->setData($data);
        return $message;
    }

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getData() {
        return $this->data;
    }

    public function setData($data) {
        $this->data = $data;
    }

    public function toJson() {
        return json_encode(array(
            $this->id => $this->data
        ));
    }
}