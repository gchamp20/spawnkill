<?php
namespace SpawnKill;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use SpawnKill\Topic;
use SpawnKill\SocketMessage;
use SpawnKill\SpawnKillCurlManager;
use SpawnKill\Config;

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
    public function onOpen(ConnectionInterface $client) {

        //On ajoute le nouveau connecté aux clients
        $this->clients->attach($client);
        echo "Nouvelle connexion : {$client->resourceId}\n";
    }

    public function onMessage(ConnectionInterface $client, $json) {

        $message = SocketMessage::fromJson($json);

        if($message === false) {
            return;
        }

        switch($message->getId()) {

            case 'updateTopicsAndPushInfos' :
                $this->updateTopicsAndPushInfos($client->remoteAddress);
                break;

            case 'startFollowingTopic' :
                $this->clientStartFollowingTopic($client, $message->getData());
                break;
        }

        echo "\n";
    }

    /**
     * met à jour l'état de tous les topics et notifie les clients 
     * des topics modifiés si c'est nécessaire.
     */
    protected function updateTopicsAndPushInfos($remoteAddress) {

        //Seul le serveur peut exécuter cet appel
        echo $remoteAddress . "\n";
        echo Config::$SERVER_IP . "\n";
    }

    /**
     * Ajoute le suivi d'un topic à un client.
     */
    protected function clientStartFollowingTopic($client, $topicId) {

        if(!is_string($topicId)) {
            return;
        }

        echo "Ajout du suivi du topic '$topicId' au client '{$client->resourceId}' ...\n";
        //Si le topic n'est pas déjà suivi
        if(!isset($this->topics[$topicId])) {
            echo "Nouveau topic suivi : '{$topicId}'\n";
            $this->topics[$topicId] = new Topic($topicId);
        }

        $this->topics[$topicId]->addFollower($client);
    }

    /**
     * Déconnexion d'un utilisateur.
     */
    public function onClose(ConnectionInterface $client) {

        //On parcourt tous les topics suivis
        foreach ($this->topics as $topic) {
            //On supprime l'utilisateur déconnecté du suivi
            $topic->removeFollower($client);

            //Si le topic n'est plus suivi, on le supprime
            if($topic->getFollowers()->count() === 0) {
                $topics->detach($topic);
            }
        }

        //On supprime l'utilisateur
        $this->clients->detach($client);
    }

    public function onError(ConnectionInterface $client, \Exception $e) {

        $client->close();
        echo "Erreur : {$e->getMessage()}\n";
    }
}