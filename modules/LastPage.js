"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * LastPage : Ce module permet d'accéder à la dernière page d'un topic
 * directement depuis la liste des sujets et de mettre en favoris un
 * lien pointant toujours vers la dernière page d'un topic.
 */
SK.moduleConstructors.LastPage = SK.Module.new();

SK.moduleConstructors.LastPage.prototype.id = "LastPage";
SK.moduleConstructors.LastPage.prototype.title = "Dernière page";
SK.moduleConstructors.LastPage.prototype.description = "Permet d'accéder à la dernière page d'un topic directement depuis la liste des sujets et de conserver un lien vers la dernière page en favoris.";

/**
 * Initialise le module, fonction appelée quand le module est chargé
 */
SK.moduleConstructors.LastPage.prototype.init = function() {
    // Ajoute un lien vers la dernière page du topic
    if (SK.Util.currentPageIn(SK.common.Pages.TOPIC_LIST)) {
        this.addLastPageLinks();
    }

    // Si on est sur la page lecture et que lastPageBookmarkLink est activé
    else if (SK.Util.currentPageIn(SK.common.Pages.TOPIC_READ) && this.getSetting("lastPageBookmarkLink")) {

        //Si le hash #last-page est présent, on switch à la dernière page
        if (location.hash === "#last-page") {

            // On scrolle sur la dernière page
            var reloadToLastPage = this.goToLastPageIfPossible();

            //Si on est déjà sur la dernière page, on va au dernier post
            if(!reloadToLastPage) {
                this.scrollToLastPost();
            }
        }

        // On ajoute un bouton "lien vers la dernière page"
        $(".bloc_forum .sujet span, .bloc_inner .sujet span").prepend(new SK.Button({
            text: document.title,
            class: "last-page-bookmark-link minor link",
            href: "#last-page",
            wrapper: {
                class: "last-page-link-wrp",
            },
            tooltip: {
                text: "Lien vers la dernière page de ce topic",
            },
            click: function(event) {
                event.preventDefault();
                location.hash = $(this).attr("href");
                location.reload();
            }
        }));
    }
};

/**
 * Ajoute le lien vers la dernière page du topic sur l'icone du sujet
 */
SK.moduleConstructors.LastPage.prototype.addLastPageLinks = function() {

    var self = this;

    //On parcourt la liste des topics
    $("#table-liste-topic-forum tbody tr").each(function() {

        var $topic = $(this);

        var POST_PER_PAGE = 20;

        //Nombre de posts
        var postCount = parseInt($topic.find("td:eq(2)").html());

        //Nombre de pages
        var pageCount = Math.floor(postCount / POST_PER_PAGE + 1);

        var topicLink = $topic.find(".titre-topic a").attr("href");

        //Dans le lien, on remplace le numéro de la page par la dernière page
        var lastPageLink = topicLink.replace(/(\/forums\/[\d]*-[\d]*-[\d]*-)[\d]*(-.*)/, "$1" + pageCount + "$2");

        //Si lastPageBookmarkLink est activé, on ajoute le hash #last-page au lien pour que
        //celui-ci pointe toujours vers la dernière page

        if (self.getSetting("lastPageBookmarkLink")) {
            lastPageLink += "#last-page";
        }

        //On ajoute le lien dernière page à l'icone des topics
        $topic.find("td:eq(0) img").wrap($("<a>", {
            class: "last-page-link",
            href: lastPageLink,
            title: "Accéder à la dernière page du sujet"
        }));
    });
};

/**
 * Scrolle la page au dernier message.
 */
SK.moduleConstructors.LastPage.prototype.scrollToLastPost = function() {
    $(".msg").last().scrollThere();
};

/**
 * Si on n'est pas déjà sur la dernière page (bouton présent),
 * on va sur cette dernière page.
 * Sinon, retourne false
 */
SK.moduleConstructors.LastPage.prototype.goToLastPageIfPossible = function() {

    var lastPageUrl = $(".p_fin").first().attr("href");

    if(typeof lastPageUrl !== "undefined") {
        location.href = $(".p_fin").first().attr("href") + "#last-page";
        return true;
    }
    else {
        return false;
    }
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
    },
    lastPageBookmarkLink: {
        title: "Raccourci vers la dernière page depuis le topic",
        description: "Ajoute un lien \"Dernière page\" qui permet de mettre en raccourci la dernière page d'un topic.",
        type: "boolean",
        default: true,
    },
};


/**
 * Le script est exécuté sur la liste des sujets
 */
SK.moduleConstructors.LastPage.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn(SK.common.Pages.TOPIC_LIST, SK.common.Pages.TOPIC_READ);
};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.moduleConstructors.LastPage.prototype.getCss = function() {

    var css = "";

    if (this.getSetting("showIndicator")) {
        css += "\
            .titre-topic {\
                margin-left: 32px !important;\
            }\
            a.last-page-link::after {\
              content: \"\";\
              display: block;\
              position: absolute;\
                left: 20px;\
                top: 4px;\
              border: solid 4px transparent;\
              border-left-color: #999;\
            }\
            a.last-page-link:hover::after {\
              border-left-color: #000;\
            }\
        ";
    }

    if (this.getSetting("lastPageBookmarkLink")) {
        css += "\
            .bloc_forum h1,\
            .bloc_inner h4 {\
                overflow: visible !important;\
            }\
            .last-page-link-wrp {\
                margin-top: 2px;\
                margin-right: 5px;\
            }\
            .sk-button .last-page-bookmark-link {\
                font-size: 0px;\
            }\
            .sk-button-content.link {\
                background-image: url('" + GM_getResourceURL("link") + "');\
                background-color: #A3A3A3;\
                border-bottom-color: #525252;\
            }\
        ";
    }

    return css;
};
