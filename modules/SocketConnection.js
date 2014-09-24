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

/**
 * Vrai si le client est connecté au serveur de websocket.
 */
SK.moduleConstructors.SocketConnection.prototype.connected = true;

SK.moduleConstructors.SocketConnection.prototype.init = function() {
	var conn = new WebSocket(SK.common.SOCKET_SERVER_URL + ":" + SK.common.SOCKET_SERVER_PORT);
	conn.onopen = function() {
	    conn.send(JSON.stringify({startFollowingTopic: SK.common.topicId}));
	};
	conn.onmessage = function(event) {
		console.log(JSON.parse(event.data));
	};

};