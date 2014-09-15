Documentation - Mise en place du serveur de socket de SpawnKill
===============================================================

Description
-----------

Le serveur de sockets de base est basé sur `Ratchet`.
Il permet de maintenir des liens entre des clients et des topics afin de les avertir quand les infos du topic sont mises à jour.
Le lien entre un client et un topic est fait, à la demande du client, par le message `startFollowingTopic`.
Les demandes de mises à jour sont effectuées à intervalle régulier par un "updater" client basé sur le module nodejs `websocket`. Ces demandes sont effectuées avec le message `updateTopicsAndPushInfos`. Seules les demandes de mises à jour envoyées depuis le serveur sont prises en compte.

Installation
------------

__Version minimum de PHP :__ 5.3.9

### Installation du serveur PHP

#### Dépendances

Depuis le `/` du dépôt :
```
cd server/socket
php composer.phar install
```

#### Lancement

```
php server/socket/bin/spawnkill-server.php
```

### Installation de l'updaterJS

#### Dépendances

```
apt-get install node
```

#### Lancement

```
node server/socket/bin/update-topics-client.js
```