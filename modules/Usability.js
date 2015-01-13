"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Usability : Permet d'ajouter des fonctionnalités améliorant l'ergonomie générale du forum
 */
SK.moduleConstructors.Usability = SK.Module.new();

SK.moduleConstructors.Usability.prototype.id = "Usability";
SK.moduleConstructors.Usability.prototype.title = "Amélioration de l'ergonomie";
SK.moduleConstructors.Usability.prototype.description = "Ajoute quelques fonctionnalités simples permettant d'améliorer la navigation";


SK.moduleConstructors.Usability.prototype.init = function() {
    //Rafraichir -> dernier post
    if (this.getSetting("refreshToLastPost")) {

        //La page vient d'être rafraichie
        if (this.isJustRefreshed()) {
            //Scrolle jusqu'au dernier message
            this.scrollToLastPost();

            // Nettoie l'URL
            window.location.hash = "";
        }
        this.editRefreshLinks();
    }
    this.bindFocusOnNewMessage();
};

/**
 * Modifie les liens de rafraichissement du sujet pour qu'ils renvoient vers le dernier post
 */
SK.moduleConstructors.Usability.prototype.editRefreshLinks = function() {

    // On supprime la classe du bouton actualiser pour modifier son comportement
    $(".btn-actualiser-forum")
        .removeClass("btn-actualiser-forum")
        .on("click", function() {
            window.location.href = SK.Util.currentSimpleUrl() + "#refresh";
            window.location.reload();
        })
    ;
};

SK.moduleConstructors.Usability.prototype.isJustRefreshed = function() {
    //Cette regexp teste si l'url contient ?refresh=1
    var regexp = /#refresh/;

    //Teste si la requête vient du bouton Rafraichir
    return regexp.test(document.URL);
};

/**
 * Scrolle la page au dernier message.
 */
SK.moduleConstructors.Usability.prototype.scrollToLastPost = function() {
    $(".conteneur-message").last().scrollThere();

};

/**
 * Ajoute le focus sur le sujet au clic sur "Nouveau topic"
 */
SK.moduleConstructors.Usability.prototype.bindFocusOnNewMessage = function() {
    $(".btn-repondre-msg").on("mousedown", function() {
        setTimeout(function() {
            $("#message_topic").focus();
        }, 500);
    });
};

SK.moduleConstructors.Usability.prototype.settings = {
    refreshToLastPost: {
        title: "Rafraîchir au dernier message",
        description: "Le bouton \"Rafraîchir\" d'un topic amène directement au dernier post de ce topic",
        type: "boolean",
        default: true,
    },
};

SK.moduleConstructors.Usability.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn(SK.common.Pages.TOPIC_READ, SK.common.Pages.TOPIC_LIST);
};
