"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Représente une fenêtre modale de SpawnKill, options possibles :
 * title (string) : Titre de la modale, si vide il ne peut pas y avoir de bouton fermer
 * content (string | jQuery Element) : Contenu HTML de la modale
 * buttons (Array<SK.Button>) : Tableau de boutons à ajouter à la modale
 * location (string) : Position de la modale "top" (defaut), "center", "notification"
 * hasCloseButton (boolean) : true (default) or false, vrai si un bouton doit être affiché en haut à droite de la modale
 * closeButtonAction : fonction appelée quand on clique sur le bouton fermer. Par défaut, la modale se ferme.
 * onModalShow : fonction appelée une fois que la modale est ajoutée au DOM (avant de lancer la transition)
 * + options jQuery
 */
SK.Modal = function(options) {

    var title = options.title || "";
    delete options.title;
    var buttons = options.buttons && options.buttons.length > 0 ? options.buttons : [];
    delete options.buttons;
    var content = options.content || "";
    delete options.content;
    var location = options.location || "top";
    delete options.location;
    var onModalShow = options.onModalShow || function() {};
    delete options.onModalShow;


    var hasCloseButton = true;
    if(options.hasCloseButton === false) {
        hasCloseButton = false;
    }
    delete options.hasCloseButton;
    var closeButtonAction = options.closeButtonAction;
    delete options.closeButtonAction;

    var titleHtml = title ? "<h3>" + title + "</h3><hr>" : "";

    var $modal = $("<div>", options);
    $modal.addClass("modal-box " + location);
    $modal.html(
        titleHtml +
        "<div class='content' ></div>" +
        "<div class='box buttons'></div>"
    );

    $modal.find(".content").append(content);

    //On ajoute la fonction onModalShow
    $modal.onModalShow = onModalShow;

    //On ajoute les boutons à la modale
    var $buttons = $modal.find(".box.buttons");
    for(var key in buttons) {
        $buttons.prepend(buttons[key]);
    }

    //Si besoin, on ajoute un bouton fermer à la modale
    if(hasCloseButton) {
        $modal.find("h3").append(new SK.Button({
            class: "sk-close transparent",
            tooltip: {
                position: "bottom" + (location === "notification" ? "-right" : ""),
                text: "Fermer la box"
            },
            wrapper: {
                class: "sk-close"
            },
            click: function() {
                if(typeof closeButtonAction === "function") {
                    closeButtonAction();
                }
                else {
                    SK.Util.hideModal();
                }
            }
        }));
    }

    //Si la modale doit être centrée, on récupère ses dimensions
    if(location === "center") {

        $modal.hide();
        $("#jv-footer").append($modal);

        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        //On récupère ses dimensions pour mettre à jour sa position
        $modal.css({
            left: (windowWidth / 2 - $modal.outerWidth() / 2) + "px",
            top: (windowHeight / 2 - $modal.outerHeight() / 2) + "px"
        });

        $modal.detach();
        $modal.show();
    }

    return $modal;
};
