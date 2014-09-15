<?php
namespace SpawnKill;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use SpawnKill\Topic;
use SpawnKill\SocketMessage;
use SpawnKill\SpawnKillCurlManager;
use SpawnKill\Config;
use SpawnKill\Log;

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
        
        Log::ln("Nouvelle connexion : {$client->resourceId}");
    }

    public function onMessage(ConnectionInterface $client, $json) {

        $message = SocketMessage::fromJson($json);

        print_r($message);

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

        Log::ln();
    }

    /**
     * met à jour l'état de tous les topics et notifie les clients 
     * des topics modifiés si c'est nécessaire.
     */
    protected function updateTopicsAndPushInfos($remoteAddress) {

        Log::ln("Mise à jour des topics");

        //Seul le serveur peut exécuter cet appel
        if($remoteAddress === Config::$SERVER_IP) {

            foreach ($this->topics as $topic) {
                Log::ln("Mise à jour du topic '{$topic->getId()}'");

            }
        }

        Log::ln();
    }

    /**
     * Ajoute le suivi d'un topic à un client.
     */
    protected function clientStartFollowingTopic($client, $topicId) {

        if(!is_string($topicId)) {
            return;
        }
        Log::ln("Ajout du suivi du topic '$topicId' au client '{$client->resourceId}' ...");
        //Si le topic n'est pas déjà suivi
        if(!isset($this->topics[$topicId])) {
            Log::ln("Nouveau topic suivi : '{$topicId}'");
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
        Log::ln("Erreur : {$e->getMessage()}");
    }
}