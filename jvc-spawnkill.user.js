// ==UserScript==
// @name        JVC SpawnKill
// @description JVC SpawnKill est un plugin pour jeuxvideo.com ajoutant des fonctionnalités comme les avatars, les citations ou les signatures.
// @author      Spixel_
// @namespace   http://www.spixel.fr
// @include     http://*.jeuxvideo.com*
// @version     1.15.0.1
// @downloadURL https://github.com/dorian-marchal/spawnkill/raw/master/jvc-spawnkill.user.js
// @updateURL   https://github.com/dorian-marchal/spawnkill/raw/master/jvc-spawnkill.meta.js
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/jquery-2.1.1.min.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/jquery-plugins.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/base.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/Util.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/Message.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/Author.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/Button.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/SlideToggle.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/Modal.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/DropdownList.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/FaviconNotificationUpdater.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/SocketMessage.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/Module.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/SpawnkillBase.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/Settings.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/SocketConnection.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/QuickResponse.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/Quote.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/Shortcuts.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/InfosPseudo.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/HilightNewTopic.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/LastPage.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/EmbedMedia.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/WarnOnNewPost.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/AutoUpdate.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/PemtHighlight.js?v1.15.0.1
// @require     https://github.com/dorian-marchal/spawnkill/raw/master/modules/Usability.js?v1.15.0.1
// @resource    close                 https://github.com/dorian-marchal/spawnkill/raw/master/images/close.png
// @resource    banImage              https://github.com/dorian-marchal/spawnkill/raw/master/images/ban.png
// @resource    newTopic              https://github.com/dorian-marchal/spawnkill/raw/master/images/topic_new.gif
// @resource    carton                https://github.com/dorian-marchal/spawnkill/raw/master/images/carton.png
// @resource    bronze                https://github.com/dorian-marchal/spawnkill/raw/master/images/bronze.png
// @resource    argent                https://github.com/dorian-marchal/spawnkill/raw/master/images/argent.png
// @resource    or                    https://github.com/dorian-marchal/spawnkill/raw/master/images/or.png
// @resource    rubis                 https://github.com/dorian-marchal/spawnkill/raw/master/images/rubis.png
// @resource    emeraude              https://github.com/dorian-marchal/spawnkill/raw/master/images/emeraude.png
// @resource    diamant               https://github.com/dorian-marchal/spawnkill/raw/master/images/diamant.png
// @resource    saphir                https://github.com/dorian-marchal/spawnkill/raw/master/images/saphir.png
// @resource    female                https://github.com/dorian-marchal/spawnkill/raw/master/images/female.png
// @resource    male                  https://github.com/dorian-marchal/spawnkill/raw/master/images/male.png
// @resource    unknown               https://github.com/dorian-marchal/spawnkill/raw/master/images/unknown.png
// @resource    plus                  https://github.com/dorian-marchal/spawnkill/raw/master/images/plus.png
// @resource    minus                 https://github.com/dorian-marchal/spawnkill/raw/master/images/minus.png
// @resource    link                  https://github.com/dorian-marchal/spawnkill/raw/master/images/link.png
// @resource    anchor                https://github.com/dorian-marchal/spawnkill/raw/master/images/anchor.png
// @resource    quote                 https://github.com/dorian-marchal/spawnkill/raw/master/images/quote.png
// @resource    mp                    https://github.com/dorian-marchal/spawnkill/raw/master/images/mp.png
// @resource    alert                 https://github.com/dorian-marchal/spawnkill/raw/master/images/alert.png
// @resource    link-gray             https://github.com/dorian-marchal/spawnkill/raw/master/images/link-gray.png
// @resource    search-topics         https://github.com/dorian-marchal/spawnkill/raw/master/images/search-topics.png
// @resource    calendar              https://github.com/dorian-marchal/spawnkill/raw/master/images/calendar.png
// @resource    clock                 https://github.com/dorian-marchal/spawnkill/raw/master/images/clock.png
// @resource    crown                 https://github.com/dorian-marchal/spawnkill/raw/master/images/crown.png
// @resource    settings              https://github.com/dorian-marchal/spawnkill/raw/master/images/settings.png
// @resource    youtube               https://github.com/dorian-marchal/spawnkill/raw/master/images/youtube.png
// @resource    vimeo                 https://github.com/dorian-marchal/spawnkill/raw/master/images/vimeo.png
// @resource    vine                  https://github.com/dorian-marchal/spawnkill/raw/master/images/vine.png
// @resource    dailymotion           https://github.com/dorian-marchal/spawnkill/raw/master/images/dailymotion.png
// @resource    sondageio             https://github.com/dorian-marchal/spawnkill/raw/master/images/sondageio.png
// @resource    image                 https://github.com/dorian-marchal/spawnkill/raw/master/images/image.png
// @resource    vocaroo               https://github.com/dorian-marchal/spawnkill/raw/master/images/vocaroo.png
// @resource    loader                https://github.com/dorian-marchal/spawnkill/raw/master/images/loader.gif
// @resource    big-loader            https://github.com/dorian-marchal/spawnkill/raw/master/images/big-loader.gif
// @resource    error                 https://github.com/dorian-marchal/spawnkill/raw/master/images/error.png
// @resource    notification          https://github.com/dorian-marchal/spawnkill/raw/master/audio/notification.ogg
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_setClipboard
// @run-at document-start
// ==/UserScript==

"use strict";
/* jshint unused: false */
/* jshint multistr: true */
/* jshint newcap: false */

SK.VERSION = "v1.15.0.1";

var modulesStyle = "";

//On charge seulement les modules nécessaires
for(var key in SK.moduleConstructors) {

    var moduleName = key;
    var module = new SK.moduleConstructors[key]();
    var moduleSettings = SK.Util.getValue(moduleName);
    //On prépare le chargement du module
    SK.modules[moduleName] = module;

    //On récupère les préférences courantes des options du module
    for(var settingKey in module.settings) {
        var setting = module.settings[settingKey];
        var settingLabel = settingKey;
        var settingValue = SK.Util.getValue(moduleName + "." + settingLabel);

        //Si la préférence n'est pas enregistrée, on prend la valeur par défaut
        if(settingValue === null) {
            settingValue = setting.default;
        }

        //On enregistre la préférence dans le module
        setting.value = settingValue;
    }

    //Si le module est requis, qu'il n'y a pas de préférences ou que la préférence est activé
    if(module.required || moduleSettings === null || moduleSettings) {

        //On autorise le module à exécuter du code avant le chargement du CSS
        module.beforeInit();

        //On charge le CSS du module
        modulesStyle += module.internal_getCss();

        //On indique que le module est chargé
        module.activated = true;
    }
    else {
        module.activated = false;
    }

}

//On ajoute le style de tous les modules actifs
SK.Util.addCss(modulesStyle);


//document.ready ne fonctionne pas sur GM.
//Pour vérifier que le DOM est chargé, on vérifie que le footer est présent.
var checkDomReady = setInterval(function() {

    var initModule = function(module) {
        module.internal_init();
    };

    if($(".stats").length > 0) {

        clearInterval(checkDomReady);

        //On initialise les modules actifs
        for(var key in SK.modules) {
            if(SK.modules[key].activated) {
                initModule(SK.modules[key]);
            }
        }
    }

}, 50);
