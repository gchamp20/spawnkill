"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * SocketConnection : Permet de se connecter au serveur de websocket
 */
SK.moduleConstructors.SocketConnection = SK.Module.new();

SK.moduleConstructors.SocketConnection.prototype.id = "SocketConnection";
SK.moduleConstructors.SocketConnection.prototype.title = "Client Websocket";
SK.moduleConstructors.SocketConnection.prototype.description = "Permet de se connecter au serveur de websocket";
SK.moduleConstructors.SocketConnection.prototype.required = true;
SK.moduleConstructors.SocketConnection.prototype.hidden = true;

SK.moduleConstructors.SocketConnection.prototype.serverConnection = null;

SK.moduleConstructors.SocketConnection.prototype.onConnectListeners = [];
SK.moduleConstructors.SocketConnection.prototype.onMessageListeners = {};
SK.moduleConstructors.SocketConnection.prototype.onCloseListeners = [];

SK.moduleConstructors.SocketConnection.prototype.init = function() {

	this.openServerConnection();

};

/**
 * Ouvre une connexion au serveur de socket
 */
SK.moduleConstructors.SocketConnection.prototype.openServerConnection = function() {

	//On ouvre une connexion au serveur
	this.serverConnection = new WebSocket(SK.config.SOCKET_SERVER_URL + ":" + SK.config.SOCKET_SERVER_PORT);

	//Connexion ouverte : On prévient les listeners
	this.serverConnection.onopen = function() {
		for (var i in this.onConnectListeners) {
			this.onConnectListeners[i]();
		}

	}.bind(this);

	//Nouveau message : On parse le message et on prévient les listeners
	this.serverConnection.onmessage = function(event) {

		var message = SK.SocketMessage.fromJson(event.data);

		//Message mal formaté, on laisse tomber
		if (message === false) {
			return;
		}

		//On averti tous les listeners
		if (typeof this.onMessageListeners[message.id] !== "undefined") {

			for (var i in this.onMessageListeners[message.id]) {
				this.onMessageListeners[message.id][i](message.data);
			}
		}
	}.bind(this);

	//Connexion fermée : On prévient les listeners
	this.serverConnection.onclose = function() {

		for (var i in this.onCloseListeners) {
			this.onCloseListeners[i]();
		}

	}.bind(this);
};

/**
 * Ajoute un listener executée quand un message d'id passé en paramètre est reçu.
 * Les données reçues sont passées en paramètre du listener.
 * @param {String} id ID du message
 * @param {function} listener Fonction executée à la réception du message avec les données reçues en paramètre
 */
SK.moduleConstructors.SocketConnection.prototype.addOnMessageListener = function(id, listener) {

	if (typeof this.onMessageListeners[id] === "undefined") {
		this.onMessageListeners[id] = [];
	}
	this.onMessageListeners[id].push(listener);
};

/**
 * Ajoute un listener executé quand la connexion est fermée.
 */
SK.moduleConstructors.SocketConnection.prototype.addOnCloseListener = function(listener) {

	this.onCloseListeners.push(listener);
};

/**
 * Ajoute une fonction executée quand la connexion est en place.
 * Si this.isConnected est vrai, exécute immédiatement la fonction,
 * sinon, ajoute la fonction aux listeners de l'onOpen event.
 */
SK.moduleConstructors.SocketConnection.prototype.addOnConnectListener = function(listener) {
	if(this.isConnected()) {
		listener();
	}
	else {
		this.onConnectListeners.push(listener);
	}
};

/**
 * Envoie un message au serveur.
 * Attention, la connexion doit être en place.
 */
SK.moduleConstructors.SocketConnection.prototype.sendMessage = function(id, data) {

	data = data || null;
	var message = SK.SocketMessage.fromData(id, data);
	this.serverConnection.send(message.toJson());
};

/**
 * @return {boolean} Vrai si la connexion est en place.
 */
SK.moduleConstructors.SocketConnection.prototype.isConnected = function() {
	return this.serverConnection !== null && this.serverConnection.readyState === 1;
};