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

    //Retour liste des sujets -> première page
    if (this.getSetting("firstPageTopicList")) {
        this.editTopicListLinks();
    }

    //Rafraichir -> dernier post
    if (this.getSetting("refreshToLastPost")) {

        //La page vient d'être rafraichie
        if (this.isJustRefreshed()) {

            //Scrolle jusqu'au dernier message
            this.scrollToLastPost();
        }
        this.editRefreshLinks();
    }
};

/**
 * Modifie les liens de rafraichissement du sujet pour qu'ils renvoient vers le dernier post
 */
SK.moduleConstructors.Usability.prototype.editRefreshLinks = function() {

    setTimeout(function() {

        var $refreshButton = $(".bt_rafraichir");
        var refreshUrl = document.URL;

        //Modification du bouton Refresh
        if (!this.isJustRefreshed()) {
            refreshUrl += "?refresh=1";
        }

        $refreshButton.attr("href", refreshUrl);

    }.bind(this), 1500);
};

/**
 * Modifie les liens de retour à la liste des sujets pour qu'ils renvoient vers la première page
 */
SK.moduleConstructors.Usability.prototype.editTopicListLinks = function() {

    //On parcourt les boutons de retour à la liste des sujets
    var $topicListButtons = $(".liste > a");

    var url = $topicListButtons.first().attr("href");
    var newUrl = url.replace(/forums\/26-(\d+)-\d+-/, "forums/26-$1-0-");

    $topicListButtons.attr("href", newUrl);
};


SK.moduleConstructors.Usability.prototype.isJustRefreshed = function() {
    //Cette regexp teste si l'url contient ?refresh=1
    var regexp = /\?refresh=1/;

    //Teste si la requête vient du bouton Rafraichir
    return regexp.test(document.URL);
};


/**
 * Scrolle la page au dernier message.
 */
SK.moduleConstructors.Usability.prototype.scrollToLastPost = function() {
    $(".msg").last().scrollThere();
};


SK.moduleConstructors.Usability.prototype.settings = {
    firstPageTopicList: {
        title: "Retourner à la première page de la liste des sujets",
        description: "Le bouton \"liste des sujets\" retourne directement à la première page de la liste",
        type: "boolean",
        default: true,
    },
    refreshToLastPost: {
        title: "Rafraîchir au dernier message",
        description: "Le bouton \"Rafraîchir\" d'un topic amène directement au dernier post de ce topic",
        type: "boolean",
        default: true,
    },
    spawnkillModerationButtons: {
        title: "Changer le look des boutons de modération",
        description: "Remplace les boutons de modération par des boutons SpawnKill",
        type: "boolean",
        default: false,
    },
};

SK.moduleConstructors.Usability.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn(SK.common.Pages.TOPIC_READ, SK.common.Pages.TOPIC_RESPONSE);
};
