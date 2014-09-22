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
class UpdateTopicsServer implements MessageComponentInterface {

    protected $mainServerConnection;
    /**
     * Permet de faire facilement des requêtes HTTP parallèles
     */
    protected $curlm;

    private $logger;

    public function __construct() {

        $this->logger = new Logger("upda", "yellow");
        $this->curlm = new TopicCurlManager();
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
    public function onOpen(ConnectionInterface $connection) {

        //On autorise seulement les connexions depuis le serveur
        if (is_null($this->mainServerConnection) && $this->isConnectionFromServer($connection)) {
            $this->logger->ln("Mise en place de la connexion au serveur principal.");
            $this->mainServerConnection = $connection;
        }
        else {
            $message = SocketMessage::fromData('connectionError', 'Serveur déjà connecté');
            $connection->send($message->toJson());
        }

    }

    public function onMessage(ConnectionInterface $connection, $json) {

        //On autorise seulement les connexions depuis le serveur
        if ($this->isConnectionFromServer($connection)) {

            //Création d'un message à partir du JSON
            $message = SocketMessage::fromJson($json);

            if($message === false) {
                $this->logger->ln("Nouveau message mal formate : '{$json}'", 2);
                return;
            }

            $this->logger->ln("Nouveau message : '{$message->getId()}'", 2);

            switch ($message->getId()) {

                case 'getTopicUpdates' :
                    $this->getTopicUpdates($message->getData());
                    break;

                case 'ping' :
                    $this->logger->ln("pong: " . $message->getData());
                    break;
            }

            $this->logger->ln('--', 2);
        }
    }

    /**
     * Met en place le lien avec le serveur principal.
     */
    private function linkMainServer($client) {
        $this->logger->ln("Mise en place du lien avec le serveur de mise a jour");
        $this->mainServerConnection = $client;
    }

    /**
     * Récupère la mises à jour des topics et les communique au serveur principal
     */
    private function getTopicUpdates($serializedTopics) {

        $topics = unserialize(SocketMessage::uncompress($serializedTopics));

        $this->logger->ln('Mise a jour de ' . count($topics) . ' topics...', 2);

        //On reset les topics
        $this->curlm->clearTopics();

        foreach ($topics as $topic) {

            $this->logger->ln("Topic '{$topic->getId()}' marque pour mise a jour", 3);
            $this->curlm->addTopic($topic);
        }

        //Récupération des infos des topics
        $topics = $this->curlm->getUpdatedTopics();

        //On envoie les infos au serveur principal
        $updateMessage = SocketMessage::fromData("topicsUpdate", SocketMessage::compress(serialize($topics)));
        $this->mainServerConnection->send($updateMessage->toJson());
    }

    /**
     * Déconnexion
     */
    public function onClose(ConnectionInterface $connection) {

        $this->mainServerConnection = null;
    }

    public function onError(ConnectionInterface $connection, \Exception $e) {

        $connection->close();
        $this->logger->ln("Erreur : {$e->getMessage()}");
    }
}