"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * SocketClient : Permet de se connecter au serveur de websocket
 */
SK.moduleConstructors.SocketClient = SK.Module.new();

SK.moduleConstructors.SocketClient.prototype.id = "SocketClient";
SK.moduleConstructors.SocketClient.prototype.title = "Client Websocket";
SK.moduleConstructors.SocketClient.prototype.description = "Permet de se connecter au serveur de websocket";
SK.moduleConstructors.SocketClient.prototype.required = true;
SK.moduleConstructors.SocketClient.prototype.hidden = true;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.SocketClient.prototype.init = function() {
	var conn = new WebSocket(SK.common.SOCKET_SERVER_URL + ":" + SK.common.SOCKET_SERVER_PORT);
	conn.onopen = function() {
	    conn.send(JSON.stringify({startFollowingTopic: SK.common.topicId}));
	};
	conn.onmessage = function(event) {
		console.log(JSON.parse(event.data));
	};

};