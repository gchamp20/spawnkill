#!/bin/bash
php spawnkill-server.php &
php update-topics-server.php &
sleep 1
node update-to-server-link.js &
sleep 1
node update-topics-client.js &
echo "Serveur SpawnKill démarré."