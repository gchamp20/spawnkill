<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use SpawnKill\MainSocketServer;
use SpawnKill\Config;

require dirname(__DIR__) . '/vendor/autoload.php';

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            new MainSocketServer()
        )
    ),
    Config::$SERVER_PORT
);

$server->run();