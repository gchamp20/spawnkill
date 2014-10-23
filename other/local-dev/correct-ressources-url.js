"use strict";

/**
 * Ce fichier remplace la fonction GM_getResourceURL de Greasemonkey pour permettre au script
 * de fonctionner avec les fichiers locaux sous Google Chrome.
 */

var getResource = GM_getResourceURL;

GM_getResourceURL = function(resource) {
    return "data:;base64," + getResource(resource);
};