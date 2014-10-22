"use strict";
var getResource = GM_getResourceURL;

GM_getResourceURL = function(resource) {
    return "data:;base64," + getResource(resource);
};