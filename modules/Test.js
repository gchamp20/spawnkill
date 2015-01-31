"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Test : module de test
 *
 */
SK.moduleConstructors.Test = SK.Module.new();

SK.moduleConstructors.Test.prototype.id = "Test";
SK.moduleConstructors.Test.prototype.title = "Module de test";
SK.moduleConstructors.Test.prototype.description = "Module de test";

SK.moduleConstructors.Test.prototype.init = function() {

    var faviconUpdater = new SK.FaviconNotificationUpdater(location.protocol + "//www.jeuxvideo.com/favicon.ico");
    var i = 0;

    setInterval(function() {

        faviconUpdater.showFaviconCount(i++);
    }, 1000);
};
