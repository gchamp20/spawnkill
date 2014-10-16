#!/usr/bin/env node
"use strict";

/**
 * Client websocket node permettant de demander régulièrement
 * au serveur de socket de recalculer les informations des
 * topics et d'envoyer les mises à jours aux clients.
 */

var Config = require("./config.js");

var WebSocketClient = require("websocket").client;

var client = new WebSocketClient();

client.on("connectFailed", function(error) {
    console.log("Connect Error: " + error.toString());
});

client.on("connect", function(connection) {

    console.log("WebSocket client connected");

	//On demande régulièrement de mettre à jour les données
	setInterval(function() {
		connection.sendUTF(JSON.stringify({
            id: "updateTopicsAndPushInfos"
        }));
	}, Config.updateIntervalMs);


    connection.on("error", function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on("close", function() {
        console.log("echo-protocol Connection Closed");
    });

});

client.connect("ws://localhost:" + Config.serverPort);
