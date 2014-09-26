"use strict";

/**
 * Représente un message envoyé ou reçu via une connexion websocket
 */
SK.SocketMessage = function(id, data) {
    this.id = id;
    this.data = data;
};

/**
 * {string} id Identifiant du message.
 */
SK.SocketMessage.prototype.id = "";

/**
 * {mix} data Données du message
 */
SK.SocketMessage.prototype.data = null;

SK.SocketMessage.prototype.toJson = function() {
    return JSON.stringify({
        id: this.id,
        data: this.data
    });
};

/**
 * Crée un Message à partir d'une chaîne JSON.
 * @param {string} json Du type { id: "identifiant", data: "données" }
 */
SK.SocketMessage.fromJson = function(json) {

    var messageObject = null;

    try {
        messageObject = JSON.parse(json);
    }
    catch (e) {
        return false;
    }

    if(messageObject === null ||
        typeof messageObject !== "object" ||
        typeof messageObject.id !== "string"
    ) {
        return false;
    }

    var id = messageObject.id;
    var data = typeof messageObject.data !== "undefined" ? messageObject.data : null;

    var message = new SK.SocketMessage(id, data);
    return message;
};

SK.SocketMessage.fromData = function(id, data) {

    data = data || null;
    var message = new SK.SocketMessage(id, data);
    return message;
};