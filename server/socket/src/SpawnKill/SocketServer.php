<?php
namespace SpawnKill;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use SpawnKill\Topic;
use SpawnKill\SocketMessage;

class SocketServer implements MessageComponentInterface {

    protected $topic;

    public function __construct() {
        $this->topic = new Topic('12-42');
        $this->topic->setPostCount(14);
        $this->topic->setPageCount(8);
    }

    public function onOpen(ConnectionInterface $connection) {
        // Store the new connection to send messages to later
        $this->topic->addFollower($connection);
        echo "New connection! ({$connection->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $json) {

        $message = SocketMessage::fromJson($json);
        echo $message->getId();
        print_r($message->getData());
        $this->topic->sendInfosToFollowers();
    }

    public function onClose(ConnectionInterface $connection) {
        $this->topic->removeFollower($connection);
        echo "Connection {$connection->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $connection, \Exception $e) {

        $this->topic->removeFollower($connection);
        $connection->close();
        echo "An error has occurred: {$e->getMessage()}\n";
    }
}