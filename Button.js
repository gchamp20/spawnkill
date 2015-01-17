"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Représente un bouton de SpawnKill, options possibles :
 * tooltip : {
    text: Texte de la tooltip
    class: class de la tooltip
    position: placement de la tooltip ("top", "bottom" ou "right")
 }
 * wrapper : options du wrapper
 * + autres options d'un objet jQuery
 */
SK.Button = function(options) {

    //On récupère l'éventuelle tooltip
    var tooltip = options.tooltip;
    delete options.tooltip;

    var wrapperOptions = options.wrapper || {};
    delete options.wrapper;

    //On crée le bouton avec les options
    var $button = $("<div>", wrapperOptions);
    $button.addClass("sk-button");

    var $buttonContent = $("<a>", options);
    $buttonContent.addClass("sk-button-content");


    $button.append($buttonContent);

    if(typeof tooltip !== "undefined") {

        tooltip.position = tooltip.position || "top";

        var $tooltip = $("<div>", {
            class: "sk-tooltip " + tooltip.position,
            text: tooltip.text
        });

        if(tooltip.class !== "undefined") {
            $tooltip.addClass(tooltip.class);
        }

        //On ajoute la tooltip dans le vide et on calcule sa taille
        $("#jv-footer").append($tooltip);

        $button.append($tooltip.css({
            width: $tooltip.width() + 20
        }));
    }

    return $button;

};
