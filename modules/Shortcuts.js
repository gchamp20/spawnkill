"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Shortcuts: Ajoute des raccourcis aux forums
 * Ctrl + flèche gauche : Page précédente
 * Ctrl + flèche droite : Page suivante
 */
SK.moduleConstructors.Shortcuts = SK.Module.new();

SK.moduleConstructors.Shortcuts.prototype.title = "Raccourcis clavier";
SK.moduleConstructors.Shortcuts.prototype.description = "Ajoute des raccourcis clavier pour naviguer plus rapidement";

SK.moduleConstructors.Shortcuts.prototype.init = function() {

    /**
     * Analyse des touches utilisées par l'utilisateur et appel de la fonction suivant le raccourci utilisé
     */
    $(window).keydown(function(event) {

        var LEFT_ARROW_KEY = 37,
            UP_ARROW_KEY = 38,
            RIGHT_ARROW_KEY = 39,
            DOWN_ARROW_KEY = 40,
            // ENTER_KEY = 13,
            SPACE_KEY = 32,
            ESCAPE_KEY = 27,
            QUESTION_MARK_KEY = 188,
            F_CHAR_KEY = 70;

        // Si l'on se trouve dans un champ de texte, on désactive les raccourcis
        var target = event.target || event.srcElement;
        if (target.tagName === "TEXTAREA" || (target.tagName === "INPUT" && target.type === "text")) {
            return;
        }

        //Page lecture d'un topic ou page liste des sujets
        if (SK.Util.currentPageIn(SK.common.Pages.TOPIC_READ) || SK.Util.currentPageIn(SK.common.Pages.TOPIC_LIST)) {

            //Ctrl + Shift + fleche gauche -> Première page
            if (event.ctrlKey && event.shiftKey && event.keyCode === LEFT_ARROW_KEY) {
                event.preventDefault();
                $(".navig_prec a:first-child").addClass("sk-hilight").get(0).click();
                return;
            }

            //Ctrl + Shift + fleche droite -> Dernière page
            if (event.ctrlKey && event.shiftKey && event.keyCode === RIGHT_ARROW_KEY) {
                event.preventDefault();
                $(".navig_suiv a:last-child").addClass("sk-hilight").get(0).click();
                return;
            }

            //Ctrl + fleche gauche -> page précedente
            if (event.ctrlKey && event.keyCode === LEFT_ARROW_KEY) {
                event.preventDefault();
                $(".navig_prec a:last-child").addClass("sk-hilight").get(0).click();
                return;
            }

            //Ctrl + fleche droite -> page suivante
            if (event.ctrlKey && event.keyCode === RIGHT_ARROW_KEY) {
                event.preventDefault();
                $(".navig_suiv a:first-child").addClass("sk-hilight").get(0).click();
                return;
            }

            //Seulement page lecture d'un topic
            if (SK.Util.currentPageIn(SK.common.Pages.TOPIC_READ)) {

                //Ctrl + flèche haut -> Retour liste des sujets
                if (event.ctrlKey && event.keyCode === UP_ARROW_KEY) {
                    event.preventDefault();
                    $(".boutons_sujet .liste a").addClass("sk-outline").get(0).click();
                    return;
                }

                //Ctrl + Espace -> Répondre
                if (event.ctrlKey && event.keyCode === SPACE_KEY) {
                    event.preventDefault();
                    $(".bt_repondre").get(0).click();
                    return;
                }
            }

            //Seulement Page liste des sujets
            else if (SK.Util.currentPageIn(SK.common.Pages.TOPIC_LIST)) {

                //Ctrl + Espace -> Nouveau topic
                if (event.ctrlKey && event.keyCode === SPACE_KEY) {
                    event.preventDefault();
                    $("#newsujet")
                        .scrollThere()
                        .focus();
                    return;
                }

                //Ctrl + F -> Focus Recherche
                if (event.ctrlKey && event.keyCode === F_CHAR_KEY) {
                    event.preventDefault();
                    $("body").scrollThere();
                    $("#textfield_forum").focus();
                    return;
                }
            }
        }




        //Sur toutes les pages

        // Ctrl + ? : Affichage des raccourcis claviers disponibles
        if (event.ctrlKey && event.keyCode === QUESTION_MARK_KEY) {
            SK.modules.Shortcuts.showShortcutsOverlay();
        }

        //Si le module Settings est activé, Ctrl + down -> Configuration
        if (SK.modules.Settings.activated && event.ctrlKey && event.keyCode === DOWN_ARROW_KEY) {
            SK.modules.Settings.showSettings();
        }

        //S'il y a des fenêtres modales ouvertes, Escape -> Ferme les modales
        if ($(".modal-box").length > 0 && event.keyCode === ESCAPE_KEY) {
            SK.Util.hideModal();
        }

    });
};

/**
 * Affiche un overlay indiquant les raccourcis claviers disponibles
 * si l'overlay n'est pas déjà affiché à l'écran
 */
SK.moduleConstructors.Shortcuts.prototype.showShortcutsOverlay = function() {

    if ($("#shortcuts-modal").length === 0) {
        // On ferme d'abord toutes les modales
        SK.Util.hideModal(false);

        SK.Util.showModal(new SK.Modal({
            id: "shortcuts-modal",
            location: "center",
            title: "Raccourcis disponibles",
            content: "Contenu à venir...",
        }));
    }
};

SK.moduleConstructors.Shortcuts.prototype.settings = {
    showShortcutsOverlay: {
        title: "Afficher les raccourcis claviers disponibles",
        description: "Affiche un overlay indiquant les raccourcis disponibles.",
        type: "button",
        buttonLabel: "Voir les raccourcis",
        default: function() {
            SK.modules.Shortcuts.showShortcutsOverlay();
        },
    },
};

SK.moduleConstructors.Shortcuts.prototype.getCss = function() {

    var css = "\
        .sk-hilight {\
            color: " + SK.common.mainColor + " !important;\
        }\
        .sk-outline {\
            background-color: " + SK.common.mainColor + " !important;\
            outline: solid 3px " + SK.common.mainColor + " !important;\
        }\
    ";

    return css;
};
