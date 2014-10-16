#!/bin/bash
ps aux | grep "spawnkill-server.php" | awk '{print $2}' | xargs kill -9 &>/dev/null
ps aux | grep "update-topics-server.php" | awk '{print $2}' | xargs kill -9 &>/dev/null
ps aux | grep "update-to-server-link.js" | awk '{print $2}' | xargs kill -9 &>/dev/null
ps aux | grep "update-topics-client.js" | awk '{print $2}' | xargs kill -9 &>/dev/null
ps aux | grep "stats-client.js" | awk '{print $2}' | xargs kill -9 &>/dev/null
echo "Serveur SpawnKill stoppé."