<?php
namespace SpawnKill;
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class ConnectionManager implements MessageComponentInterface {

    protected $clients;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
    }

    public function onOpen(ConnectionInterface $connection) {
        // Store the new connection to send messages to later
        $this->clients->attach($connection);

        echo "New connection! ({$connection->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        $clientCount = count($this->clients) - 1;
        echo sprintf('Connection %d sending message "%s" to %d other connections' . "\n"
            , $from->resourceId, $msg);

        foreach ($this->clients as $client) {
            if ($from !== $client) {
                // The sender is not the receiver, send to each client connected
                $client->send('[message] ' . $msg);
            }
        }
    }

    public function onClose(ConnectionInterface $connection) {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($connection);

        echo "Connection {$connection->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $connection, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";

        $connection->close();
    }
}