#!/usr/bin/env node
"use strict";

var Config = require("./config.js");

console.ln = function(string) {
    var now = new Date();
    now.setHours(now.getHours() + 2);
    var jsonNow = now.toJSON();

    var hour = jsonNow.slice(8, 10) + "-" + jsonNow.slice(5, 7) + " " + jsonNow.slice(11, 19);

    console.log("[" + hour + " stat] " + string);
};

var WebSocketClient = require("websocket").client;
var statsIntervalMs = Config.statsIntervalMin * 60 * 1000;

//client du serveur principal
var client = new WebSocketClient();
var mainConnection = null;

//Gestion des erreurs de connexions
client.on("connectFailed", function(error) {
    console.ln("Erreur de connexion au serveur principal: " + error.toString());
});

//Gestion de la connexion au serveur principal
client.on("connect", function(connection) {

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

        message = JSON.parse(message.utf8Data);

        if(message.id === "clientInfos") {
            saveStats(message.data);
        }
    });

    //Envoi d'un message de synchronisation au serveur principal
    mainConnection.sendUTF(JSON.stringify({
        id: "IAmTheStatsClient"
    }));

    askForStats(mainConnection);

    setInterval(function() {

        askForStats(mainConnection);

    }, statsIntervalMs);

});

/**
 * Demande les stats du serveur principal
 */
var askForStats = function(connection) {
    connection.sendUTF(JSON.stringify({
        id: "getClientInfos"
    }));
};

/**
 * Enregistre les stats en base de données
 */
var saveStats = function(stats) {
    console.ln("Stats recues:");
    console.log(stats);
};

//Connexion au serveur principal
client.connect("ws://localhost:" + Config.serverPort);


