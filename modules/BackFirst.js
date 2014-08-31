"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * BackFirst : Ce module permet de revenir à la première page de la liste des sujets
 * lorsque l'on se trouve sur un topic.
 */
SK.moduleConstructors.BackFirst = SK.Module.new();

SK.moduleConstructors.BackFirst.prototype.id = "BackFirst";
SK.moduleConstructors.BackFirst.prototype.title = "Retour première page";
SK.moduleConstructors.BackFirst.prototype.description = "Permet de revenir à la première page de la liste des sujets lorsque l'on se trouve sur un topic.";

//Si le module est requis (impossible de le désactiver), décommenter cette ligne
// SK.moduleConstructors.BackFirst.prototype.required = true;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.BackFirst.prototype.init = function() {
    //Code exécuté au chargement du module
    this.addBackFirstLinks();
};

/**
 * Modifie le lien de retour à la liste des sujets pour qu'il renvoie vers la première page
 */
SK.moduleConstructors.BackFirst.prototype.addBackFirstLinks = function() {

    //On parcourt les boutons de retour à la liste des sujets
    $(".liste > a").each(function() {

        var $link = $(this);
    
        var url = $link.attr("href");
    
        var newUrl = url.replace(/forums\/26-(\d+)-\d+-/, "forums/26-$1-0-");
    
        $link.attr("href", newUrl);
    
    });
};


/**
 * Le script est exécuté sur les pages de lecture et de réponse à un topic.
 */
SK.moduleConstructors.BackFirst.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn([ "topic-read", "topic-response" ]);
};
