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

        $this->logger = new Logger("update server");
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
            $connection->send(json_encode(array(
                "connectionError" => "Serveur déjà connecté"
            )));
        }

    }

    public function onMessage(ConnectionInterface $connection, $json) {

        //On autorise seulement les connexions depuis le serveur
        if ($this->isConnectionFromServer($connection)) {

            //Création d'un message à partir du JSON
            $message = SocketMessage::fromJson($json);

            $this->logger->ln("Nouveau message : '{$message->getId()}'");

            if ($message === false) {
                return;
            }

            switch ($message->getId()) {

                case 'updateTopicsAndPushInfos' :
                    $this->updateTopicsAndPushInfos($message->getData());
                    break;

                case 'ping' :
                    $this->logger->ln("pong: " . $message->getData());
                    break;
            }
        }
    }

    /**
     * Met en place le lien avec le serveur principal.
     */
    private function linkMainServer($client) {
        $this->logger->ln("Mise en place du lien avec le serveur de mise à jour");
        $this->updateConnection = $client;

        sleep(2);

        $this->updateConnection->send(json_encode(array(
            "ping" => "fromMainToUpdate"
        )));
    }

    /**
     * met à jour l'état de tous les topics et notifie les clients
     * des topics modifiés si c'est nécessaire.
     */
    private function updateTopicsAndPushInfos($topics) {

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
            if (!$topicData->data->error) {

                //Si le nombre de posts du topic a changé ou que le topic vient d'être locké
                if ($topicData->data->locked ||
                    (
                        isset($topicData->data->postCount) &&
                        $topicData->data->postCount > $topicData->topic->getPostCount()
                    )
                ) {
                    $this->logger->ln("Modifié !");
                    //On met à jour les infos du topic
                    if (isset($topicData->data->postCount)) {
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