<?php
namespace SpawnKill;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use SpawnKill\Topic;
use SpawnKill\SocketMessage;
use SpawnKill\SpawnKillCurlManager;
use SpawnKill\Config;
use SpawnKill\Log;

/**
 * Serveur de socket principal de SpawnKill.
 * Gère les connexions des utilisateurs et le suivi des topics.
 * Délègue la récupération des informations des topics à UpdateTopicsServer.
 */
class MainSocketServer implements MessageComponentInterface {

    /**
     * Clients connectés au serveur
     */
    protected $clients;

    /**
     * Connexion au serveur de mise à jour
     */
    protected $updateServerConnection;

    /**
     * Liste de topics suivis par au moins un client.
     */
    protected $topics = array();

    private $logger;

    public function __construct() {

        $this->logger = new Logger("main server");
        $this->clients = new \SplObjectStorage();
    }

    /**
     * Retourne vrai si la connexion est issue du serveur.
     */
    private function isConnectionFromServer($connection) {
        return $connection->remoteAddress === Config::$SERVER_IP;
    }

    /**
     * Connexion d'un utilisateur.
     */
    public function onOpen(ConnectionInterface $client) {

        //On ajoute le nouveau connecté aux clients
        $this->clients->attach($client);

        $this->logger->ln("Nouvelle connexion : {$client->resourceId}");
    }

    /**
     * Message JSON reçu par un client
     */
    public function onMessage(ConnectionInterface $client, $json) {

        //Création d'un message à partir du JSON
        $message = SocketMessage::fromJson($json);

        $this->logger->ln("Nouveau message : '{$message->getId()}'");

        if($message === false) {
            return;
        }

        switch($message->getId()) {

            case 'updateTopicsAndPushInfos' :
                if($this->isConnectionFromServer($client)) {
                    $this->updateTopicsAndPushInfos();
                }
                break;

            case 'startFollowingTopic' :
                $this->clientStartFollowingTopic($client, $message->getData());
                break;

            case 'linkUpdateServer' :
                if($this->isConnectionFromServer($client)) {
                    $this->linkUpdateServer($client);
                }
                break;

            case 'ping' :
                $this->logger->ln("pong: " . $message->getData());
                break;

        }

    }

    /**
     * Met en place le lien avec le serveur de mise à jour des topics.
     */
    private function linkUpdateServer($client) {
        $this->logger->ln("Mise en place du lien avec le serveur de mise à jour");
        $this->updateServerConnection = $client;
    }

    /**
     * met à jour l'état de tous les topics et notifie les clients
     * des topics modifiés si c'est nécessaire.
     */
    private function updateTopicsAndPushInfos($remoteAddress) {

        $this->logger->ln("Mise à jour des topics...");


        foreach ($this->topics as $topic) {
            $this->logger->ln("Topic '{$topic->getId()}' marqué pour mise à jour");
            $this->curlm->addTopic($topic);
        }

        //Récupération des infos des topics
        $topicsData = $this->curlm->getTopicsData();

        foreach ($topicsData as $topicData) {

            $this->logger->ln("Topic '{$topicData->topic->getId()}' récupéré...");
            //On ne fait rien en cas d'erreur
            if(!$topicData->data->error) {

                //Si le nombre de posts du topic a changé ou que le topic vient d'être locké
                if($topicData->data->locked ||
                    (
                        isset($topicData->data->postCount) &&
                        $topicData->data->postCount > $topicData->topic->getPostCount()
                    )
                ) {
                    $this->logger->ln("Modifié !");
                    //On met à jour les infos du topic
                    if(isset($topicData->data->postCount)) {
                        $topicData->topic->setPostCount($topicData->data->postCount);
                    }

                    $topicData->topic->setLocked($topicData->data->locked);

                    //On envoie les données aux followers
                    $topicData->topic->sendInfosToFollowers();
                }
            }
        }

    }

    /**
     * Ajoute le suivi d'un topic à un client.
     */
    private function clientStartFollowingTopic($client, $topicId) {

        if(!is_string($topicId)) {
            return;
        }
        $this->logger->ln("Ajout du suivi du topic '$topicId' au client '{$client->resourceId}' ...");
        //Si le topic n'est pas déjà suivi
        if(!isset($this->topics[$topicId])) {
            $this->logger->ln("Nouveau topic suivi : '{$topicId}'");
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

                if(($key = array_search($topic, $this->topics, true)) !== false) {
                    unset($this->topics[$key]);
                }
            }
        }

        //On supprime l'utilisateur
        $this->clients->detach($client);
    }

    public function onError(ConnectionInterface $client, \Exception $e) {

        $client->close();
        $this->logger->ln("Erreur : {$e->getMessage()}");
    }
}