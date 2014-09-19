#!/bin/bash
php spawnkill-server.php &
php update-topics-server.php &
node update-to-server-link.js &
node update-topics-client.js &
echo "Serveur SpawnKill démarré."