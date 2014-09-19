#!/usr/bin/env node
"use strict";

/**
 * Script temporaire permettant de faire le lien entre MainSocketServer et
 * UpdateTopicsServer.
 * Ce script est client des deux serveurs ci-dessus et est chargé de faire
 * l'intermédiaire entre les deux serveurs qui ne peuvent pas communiquer sans ça.
 *
 * À terme, le serveur UpdateTopicsServer devra être remplacé par un client Node
 * ce qui permettra de supprimer ce script et d'améliorer la structure actuelle
 * qui est quand même bien crade (il faut l'avouer)
 */

console.ln = function(string) {
    console.log("[link] " + string);
};

var WebSocketClient = require("websocket").client;


//client du serveur principal
var mainClient = new WebSocketClient();
var mainConnection = null;

//client du serveur de mise à jour
var updateClient = new WebSocketClient();
var updateConnection = null;


//Gestion des erreurs de connexions
mainClient.on("connectFailed", function(error) {
    console.ln("Erreur de connexion au serveur principal: " + error.toString());
});

updateClient.on("connectFailed", function(error) {
    console.ln("Erreur de connexion au serveur de mise à jour: " + error.toString());
});


//Gestion de la connexion au serveur principal
mainClient.on("connect", function(connection) {

    mainConnection = connection;

    //Gestion des erreurs/fermetures
    mainConnection.on("error", function(error) {
        console.ln("Erreur du serveur principal: " + error.toString());
    });

    mainConnection.on("close", function() {
        console.ln("Connexion au serveur principal fermée");
    });

    //Gestion de la transmission des messages
    mainConnection.on("message", function(message) {

        if (message.type === "utf8") {
            console.ln("main -> update: '" + message.utf8Data + "'");
            updateConnection.sendUTF(message.utf8Data);
        }
    });

    //Envoi d'un message de synchronisation au serveur principal
    mainConnection.sendUTF(JSON.stringify({
        linkUpdateServer: "",
    }));

    console.ln("Connecté au serveur principal.");

    //Connexion au serveur de mise à jour
    updateClient.connect("ws://localhost:8081/");

});

//Gestion de la connexion au serveur de mise à jour
updateClient.on("connect", function(connection) {

    updateConnection = connection;

    //Gestion des erreurs/fermetures
    updateConnection.on("error", function(error) {
        console.ln("Erreur du serveur de mise à jour: " + error.toString());
    });

    updateConnection.on("close", function() {
        console.ln("Connexion au serveur de mise à jour fermée");
    });

    //Gestion de la transmission des messages
    updateConnection.on("message", function(message) {

        if (message.type === "utf8") {
            console.ln("update -> main: '" + message.utf8Data + "'");
            mainConnection.sendUTF(message.utf8Data);
        }
    });

    console.ln("Connecté au serveur de mise à jour, tout est en place.");

    mainConnection.sendUTF(JSON.stringify({
        "ping" : "fromLink"
    }));

    updateConnection.sendUTF(JSON.stringify({
        "ping" : "fromLink"
    }));

});


//Connexion au serveur principal
mainClient.connect("ws://localhost:8080/");


