"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * LastPage : Ce module permet d'accéder à la dernière page d'un topic
 * directement depuis la liste des sujets
 */
SK.moduleConstructors.LastPage = SK.Module.new();

SK.moduleConstructors.LastPage.prototype.id = "LastPage";
SK.moduleConstructors.LastPage.prototype.title = "Dernière page";
SK.moduleConstructors.LastPage.prototype.description = "Permet d'accéder à la dernière page d'un topic directement depuis la liste des sujets";

//Si le module est requis (impossible de le désactiver), décommenter cette ligne
// SK.moduleConstructors.LastPage.prototype.required = true;

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.LastPage.prototype.init = function() {
    //Code exécuté au chargement du module
    this.addLastPageLinks();
};

/**
 * Ajoute le lien vers la dernière page du topic sur l'icone du sujet
 */
SK.moduleConstructors.LastPage.prototype.addLastPageLinks = function() {

    //On parcourt la liste des topics
    $("#liste_topics tr:not(:first-child)").each(function() {

        var $topic = $(this);

        var POST_PER_PAGE = 20;

        //Nombre de posts
        var postCount = parseInt($topic.find("td:eq(3)").html());
        //Nombre de pages
        var pageCount = Math.floor(postCount / POST_PER_PAGE + 1);

        var topicLink = $topic.find("td:eq(1) a").attr("href");

        //Dans le lien, on remplace le numéro de la page par la dernière page
        var lastPageLink = topicLink.replace(/(http:\/\/www\.jeuxvideo\.com\/forums\/[\d]*-[\d]*-[\d]*-)[\d]*(-.*)/, "$1" + pageCount + "$2");

        //On ajoute le lien dernière page à l'icone des topics
        $topic.find("td:eq(0) img").wrap($("<a>", {
            class: "last-page-link",
            href: lastPageLink,
            title: "Accéder à la dernière page du sujet"
        }));

        //On réduit la taille de la date pour ne pas casser l'affichage
        $topic.find("td:eq(4)").html($topic.find("td:eq(4)").text().trim().replace(/\/[\d]{4}/, ""));
        $("#liste_topics #c5").html("Dern. Msg.");
    });
};

/**
 * Le script est exécuté sur la liste des sujets
 */
SK.moduleConstructors.LastPage.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn(SK.common.Pages.TOPIC_LIST);
};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.moduleConstructors.LastPage.prototype.getCss = function() {

    var css = "";

    if(this.getSetting("showIndicator")) {
        css += "\
            #liste_topics th#c5 {\
                width: auto;\
            }\
            #liste_topics th#c1 {\
                min-width: 26px;\
            }\
            a.last-page-link {\
              position: relative;\
              width: 27px;\
            }\
            a.last-page-link::after {\
              content: \"\";\
              display: block;\
              position: absolute;\
                left: 20px;\
                top: 2px;\
              border: solid 5px transparent;\
              border-left-color: #999;\
            }\
            a.last-page-link:hover::after {\
              border-left-color: #000;\
            }\
        ";
    }

    return css;
};

/**
 * Options configurables du plugin.
 * Ces options apparaitront dans le panneau de configuration de SpawnKill
 */
SK.moduleConstructors.LastPage.prototype.settings = {
    showIndicator: {
        title: "Ajout d'un indicateur",
        description: "Ajout d'une flèche à droite de l'image du topic pour indiquer l'intéractivité.",
        type: "boolean",
        default: true,
    }
};
