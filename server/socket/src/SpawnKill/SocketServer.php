<?php
namespace SpawnKill;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use SpawnKill\Topic;
use SpawnKill\SocketMessage;
use SpawnKill\SpawnKillCurlManager;

class SocketServer implements MessageComponentInterface {

    /**
     * Clients connectés au serveur
     */
    protected $clients;

    /**
     * Liste de topics suivis par au moins un client.
     */
    protected $topics = array();

    /**
     * Permet de faire facilement des requêtes HTTP parallèles
     */
    protected $curlm;

    public function __construct() {
        $this->clients = new \SplObjectStorage();
        $this->curlm = new SpawnKillCurlManager();
    }

    /**
     * Connexion d'un utilisateur.
     */
    public function onOpen(ConnectionInterface $connection) {

        $this->clients->attach($connection);
        echo "Nouvelle connexion : {$connection->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $connection, $json) {

        $message = SocketMessage::fromJson($json);
    }

    /**
     * Déconnexion d'un utilisateur.
     */
    public function onClose(ConnectionInterface $connection) {

        //On parcourt tous les topics suivis
        foreach ($this->topics as $topic) {
            //On supprime l'utilisateur déconnecté du suivi
            $topic->removeFollower($connection);

            //Si le topic n'est plus suivi, on le supprime
            if($topic->getFollowers()->count() === 0) {
                $topics->detach($topic);
            }
        }

        //On supprime l'utilisateur
        $this->clients->detach($connection);
    }

    public function onError(ConnectionInterface $connection, \Exception $e) {

        $connection->close();
        echo "Erreur : {$e->getMessage()}\n";
    }
}