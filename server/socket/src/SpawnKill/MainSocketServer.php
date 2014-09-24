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

        $this->logger = new Logger("main", "light_cyan");
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

        if($message === false) {
            $this->logger->ln("Nouveau message mal formate : '{$json}'", 2);
            return;
        }

        $this->logger->ln("Nouveau message : '{$message->getId()}'", 2);

        switch($message->getId()) {

            //Demande de mise à jour des topics
            case 'updateTopicsAndPushInfos' :
                if($this->isConnectionFromServer($client)) {
                    $this->delegateTopicsUpdate();
                }
                break;

            //Nouvelles données des topics disponibles
            case 'topicsUpdate' :
                if($this->isConnectionFromServer($client)) {
                    $this->pushTopicsUpdate($message->getData());
                }
                break;

            //Un client suit un nouveau topic
            case 'startFollowingTopic' :
                $this->clientStartFollowingTopic($client, $message->getData());
                break;

            //Le lien avec le serveur de mise à jour des topics est effectué
            case 'linkUpdateServer' :
                if($this->isConnectionFromServer($client)) {
                    $this->linkUpdateServer($client);
                }
                break;

            //Simple ping
            case 'ping' :
                $this->logger->ln("pong: " . $message->getData());
                break;

        }

        $this->logger->ln('--', 2);

    }

    /**
     * Met en place le lien avec le serveur de mise à jour des topics.
     */
    private function linkUpdateServer($client) {
        $this->logger->ln("Mise en place du lien avec le serveur de mise à jour");
        $this->updateServerConnection = $client;
    }

    /**
     * Demande au serveur de mise à jour de récupérer les dernières infos des topics
     * suivis.
     */
    private function delegateTopicsUpdate() {

        $this->logger->ln("Delegation de la mise a jour des topics...", 2);

        $message = SocketMessage::fromData('getTopicUpdates', SocketMessage::compress(serialize($this->topics)));
        $this->updateServerConnection->send($message->toJson());

        $this->logger->ln("envoye : " . print_r(unserialize(serialize($this->topics)), true), 3);
    }

    /**
     * Notifie les clients des topics modifiés si nécessaire.
     */
    private function pushTopicsUpdate($serializedUpdatedTopics) {

        $this->logger->ln("Notification de mise a jour des topics aux clients...", 2);

        $updatedTopics = unserialize(SocketMessage::uncompress($serializedUpdatedTopics));
        $this->logger->ln("recu : " . print_r($updatedTopics, true), 3);

        //On parcourt les mises à jour de topics
        foreach ($updatedTopics as $updatedTopic) {

            if(!isset($this->topics[$updatedTopic->getId()])) {
                continue;
            }

            $currentTopic = $this->topics[$updatedTopic->getId()];

            $this->logger->ln("Verification du topic {$updatedTopic->getId()}...", 3);

            //On ne traite pas les topics en erreur
            if($updatedTopic->error) {
                $this->logger->ln("Erreur pour le topic {$updatedTopic->getId()}...", 3);
                continue;
            }

            $this->logger->ln("Données à jour : " . print_r($updatedTopic, true) . "...", 3);
            $this->logger->ln("Données actuelles : " . print_r(unserialize(serialize($currentTopic)), true) . "...", 3);

            //On détermine si on doit pousser la nouvelle info aux clients (le nombre de posts a changé
            //  ou le topic vient d'être locké).
            if(
                !$currentTopic->isLocked() && $updatedTopic->isLocked() || //le topic vient d'être locké
                $currentTopic->getPostCount() !== $updatedTopic->getPostCount() //Nombre de posts différent
            ) {
                $this->logger->ln("Topic {$updatedTopic->getId()} modifie !", 2);

                //On met à jour le topic
                $currentTopic->setPostCount($updatedTopic->getPostCount());
                $currentTopic->setPageCount($updatedTopic->getPageCount());
                $currentTopic->setLocked($updatedTopic->isLocked());
                $currentTopic->setDataFetched(true);

                //On envoie les données aux followers si besoin
                $currentTopic->sendInfosToFollowers();
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
        $this->logger->ln("Ajout du suivi du topic '$topicId' au client '{$client->resourceId}' ...", 2);

        //Si le topic n'est pas déjà suivi
        if(!isset($this->topics[$topicId])) {
            $this->logger->ln("Nouveau topic suivi : '{$topicId}'", 2);
            $this->topics[$topicId] = new Topic($topicId);
        }
        //Si le topic est déjà suivi et que le serveur a des infos sur celui-ci
        else if($this->topics[$topicId]->getDataFetched()) {

            //On envoie ces infos au nouveau follower
            $this->topics[$topicId]->sendInfosTo($client);
        }

        $this->topics[$topicId]->addFollower($client);
    }

    /**
     * Déconnexion d'un utilisateur.
     */
    public function onClose(ConnectionInterface $client) {

        $this->logger->ln("Deconnexion : {$client->resourceId}");

        //On parcourt tous les topics suivis
        foreach ($this->topics as $topic) {
            //On supprime l'utilisateur déconnecté du suivi
            $topic->removeFollower($client);

            //Si le topic n'est plus suivi, on le supprime
            if($topic->getFollowers()->count() === 0) {

                if(($key = array_search($topic, $this->topics, true)) !== false) {
                    $this->logger->ln("Fin de suivi du topic : '{$key}'", 2);
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