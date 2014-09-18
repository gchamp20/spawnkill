"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * SocketClient : Permet de se connecter au serveur de websocket
 */
SK.moduleConstructors.SocketClient = SK.Module.new();

SK.moduleConstructors.SocketClient.prototype.id = "SocketClient";
SK.moduleConstructors.SocketClient.prototype.title = "Connexion au serveur de socket";
SK.moduleConstructors.SocketClient.prototype.description = "Permet de se connecter au serveur de websocket";
SK.moduleConstructors.SocketClient.prototype.required = true;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.SocketClient.prototype.init = function() {
};