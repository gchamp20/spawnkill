"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * UserHighlight : Description du module
 */
SK.moduleConstructors.UserHighlight = SK.Module.new();

SK.moduleConstructors.UserHighlight.prototype.id = "UserHighlight";
SK.moduleConstructors.UserHighlight.prototype.title = "Titre du nouveau module";
SK.moduleConstructors.UserHighlight.prototype.description = "Description du nouveau module";
SK.moduleConstructors.UserHighlight.prototype.required = false;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.UserHighlight.prototype.init = function() {
    //Méthode du modules
    this.uneMethodeExemple();
};

SK.moduleConstructors.UserHighlight.prototype.uneMethodeExemple = function() {
    //Ma méthode
};

/**
 * Méthode testant si un Module doit être activé.
 * peut-être redéfinie.
 * Par défaut le module est toujours activé
 */
SK.moduleConstructors.UserHighlight.prototype.shouldBeActivated = function() {
    return true;
};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.moduleConstructors.UserHighlight.prototype.getCss = function() {

	var css = "";

    return css;
};

/**
 * Options configurables du plugin.
 * Ces options apparaitront dans le panneau de configuration de SpawnKill
 */ 
SK.moduleConstructors.UserHighlight.prototype.settings = {};