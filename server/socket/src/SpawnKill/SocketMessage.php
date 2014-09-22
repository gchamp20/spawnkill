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

    public function __construct($id, $data) {
        $this->setId($id);
        $this->setData($data);
    }

    /**
     * Retourne un message à partir d'une chaîne json
     * @param String $json du type {id:{my:data}}
     */
    public static function fromJson($json) {
        $data = json_decode($json);

        if($data === null ||
            !is_object($data) ||
            key($data) === null ||
            current($data) === false
        ) {
            return false;
        }

        $message = new SocketMessage(key($data), current($data));
        return $message;
    }

    public static function fromData($id, $data) {
        $message = new SocketMessage($id, $data);
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

    public static function compress($data) {
        return utf8_encode(gzdeflate($data));
    }

    public static function uncompress($data) {
        return gzinflate(utf8_decode($data));
    }
}