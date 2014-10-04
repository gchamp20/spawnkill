Documentation - Mise en place du serveur SpawnKill
===============================================================

Prérequis
---------

- Un serveur web
- PHP (version minimum : 5.3.9)
- Un serveur MySQL (notamment pour le cache des données)
- Node.js
- Git

Description
-----------

Le serveur de sockets de base est basé sur `Ratchet`.
Il permet de maintenir des liens entre des clients et des topics afin de les avertir quand les infos du topic sont mises à jour.
Le lien entre un client et un topic est fait, à la demande du client, par le message `startFollowingTopic`.
Les demandes de mises à jour sont effectuées à intervalle régulier par un "updater" client basé sur le module nodejs `websocket`. Ces demandes sont effectuées avec le message `updateTopicsAndPushInfos`. Seules les demandes de mises à jour envoyées depuis le serveur sont prises en compte.


Récupération du code
--------------------

Se placer à l'endroit souhaité et récupérer le dépôt de SpawnKill

```
git clone https://github.com/dorian-marchal/spawnkill
```

Le dépôt est cloné dans le répertoire `spawnkill`. J'appellerai ce répertoire, la "racine du dépôt".

Installation
------------

### Installation du serveur PHP

Depuis la racine du dépôt :

```
cd server/socket
php5 composer.phar install
```

### Configuration du serveur

Ouvrir le fichier de configuration et ajuster les variables en fonction de votre configuration (depuis la racine du dépôt):

```
cp server/socket/src/SpawnKill/Config.default.php server/socket/src/SpawnKill/Config.php
nano server/socket/src/SpawnKill/Config.php
```

Faites de même pour les fichiers Javascript si vous voulez modifier les ports par défaut

```
nano server/socket/bin/update-to-server-link.js
nano server/socket/bin/update-topics-client.js
```

Configurer ensuite la base de données (toujours depuis la racine du dépôt)

```
cp server/config.default.php server/config.php
nano server/config.php
```

Ce fichier permet aussi de configurer vos infos Github pour pouvoir proposer les mises à jour aux utilisateurs du script (voir la doc de Github pour obtenir le client_id et le client_secret)

Et lancer le script de création de la base de données (toujours depuis la racine du dépôt):

```
php5 server/create-database.php
```

### Lancer le serveur

Depuis la racine du dépôt

```
server/socket/bin/start-server.sh
```

Note : par défaut, le serveur se lance sur les ports 8080 et 8081, ceci peut être modifié dans le fichier de configuration.
`stdout` et `stderr` peuvent être redirigées vers un éventuel fichier de log de cette façon :

```
server/socket/bin/start-server.sh &> /var/log/spawnkill/server.log
```

### Couper le serveur

Depuis la racine du dépôt

```
server/socket/bin/stop-server.sh
```

Faire pointer le script vers le serveur
---------------------------------------

Afin que les utilisateurs de SpawnKill se connectent sur votre serveur, il faut modifier la configuration du script.

Dans le fichier `base.js`, modifiez les trois variables suivantes pour les faire pointer vers votre serveur :

```
SERVER_URL: "http://serveur.spawnkill.fr/", // url `http` pointant vers le répertoire `/server` du dépôt spawnkill (avec un slash à la fin)
SOCKET_SERVER_URL: "ws://serveur.spawnkill.fr", // url `ws` pointant vers votre serveur
SOCKET_SERVER_PORT: 4243 //Port du serveur (correspond à `$SERVER_PORT` dans Config.php)
```