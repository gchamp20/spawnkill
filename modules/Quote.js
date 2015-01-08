"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Quote : Plugin de citation
 */
SK.moduleConstructors.Quote = SK.Module.new();

SK.moduleConstructors.Quote.prototype.id = "Quote";
SK.moduleConstructors.Quote.prototype.title = "Citations";
SK.moduleConstructors.Quote.prototype.description = "Permet de citer un message de manière propre simplement en cliquant sur un bouton \"citer\".";

SK.moduleConstructors.Quote.prototype.init = function() {

    //On transforme les citations en Html
    if(this.getSetting("betterQuote")) {
        this.initQuoteTypes();
        this.htmlizeAllQuotes();
    }

    //Citations partielles
    if(this.getSetting("partialQuote")) {
        this.initPartialQuote();
    }

};


/**
 * Ajoute une fonction de citation partielle d'un message quand un utilisateur
 * sélectionne une partie du texte d'un post
 */
SK.moduleConstructors.Quote.prototype.initPartialQuote = function() {

    var self = this;

    //Suppression des boutons de citations existants au mouseup
    $(document).on("mouseup", function() {
        // Mise en file pour laisser le temps au click event de s'exécuter
        // Si vous avez un meilleur moyen de faire ça, faites moi signe :)
        window.setTimeout(function() {

            //On supprime le bouton après la transition CSS
            $(".partial-quote")
                .on("transitionend webkitTransitionEnd oTransitionEnd", function() {
                    $(this).remove();
                })
                .removeClass("active");

        }, 0);
    });

    //bind de l'evenement au mouse up sur un post
    $(".conteneur-messages-pagi").on("mouseup", ".bloc-message-forum", function(event) {

        // On affiche le bouton de citation partielle.
        // Le délai permet d'éviter qu'il soit supprimé sur le champ et laisse le navigateur
        // retirer la sélection
        window.setTimeout(function() {

            var selectionText = SK.Util.getPostSelection();
            var $post = $(this).find(".text-enrichi-forum");
            var message = new SK.Message($post.parents(".bloc-message-forum"));

            //On supprime les liens noelshacks (qui posent problème à cause des miniatures)
            var comparableMessageText = message.text.replace(/http:\/\/www.noelshack.com\/(\d+)-(\d+)-([^\.]+\..{3})/g, "");
            comparableMessageText = comparableMessageText.replace(/http:\/\/image.noelshack.com\/fichiers\/(\d+)\/(\d+)\/([^\.]+\..{3})/g, "");
            var comparableSelectionText = selectionText.replace(/http:\/\/image.noelshack.com\/fichiers\/(\d+)\/(\d+)\/([^\.]+\..{3})/g, "");
            comparableSelectionText = comparableSelectionText.replace(/http:\/\/image.noelshack.com\/fichiers\/(\d+)\/(\d+)\/([^\.]+\..{3})/g, "");

            //De plus, on compare sans les espaces pour éviter les problèmes causés par les espace avant/après les images
            comparableMessageText = comparableMessageText.replace(/\s/g, "");
            comparableSelectionText = comparableSelectionText.replace(/\s/g, "");

            // Si la sélection est vide, ou que le texte sélectionné ne fait pas entièrement
            // partie du post, on n'affiche pas le bouton
            if (selectionText === "" || comparableMessageText.indexOf(comparableSelectionText) === -1) {
                return;
            }

            //On affiche le bouton de citation partielle
            self.addPartialQuoteButton(message, selectionText, event.pageX, event.pageY);

        }.bind(this), 100);

    });
};


/**
 * Crée et ajoute au message passé en paramètre un bouton de citation partielle.
 * Il sera positionné juste en dessous de la souris (coordonnées passées en paramètre)
 */
SK.moduleConstructors.Quote.prototype.addPartialQuoteButton = function(message, selectionText, mouseX, mouseY) {

    var self = this;

    var $partialQuoteButton = new SK.Button({
        class: "quote",
        index: 100,
        tooltip: {
            text: "Citer cette partie du message",
            position: "bottom"
        },
        wrapper: {
            class: "partial-quote"
        },
        click: function() {
            //On récupère le post de l'auteur et on remplace le texte de son message par la partie
            //sélectionnée avant de citer le message
            message.text = selectionText;
            var citationBlock = self.createCitationBlock(message);

            self.doQuotePost(citationBlock);
        }
    });

    //On ajoute le bouton de citation juste en dessous de la souris

    //On calcule la position relative de la souris par rapport au post
    var postPosition = message.$msg.offset();
    var relativeMouseX = mouseX - postPosition.left;
    var relativeMouseY = mouseY - postPosition.top;

    $partialQuoteButton.css({
        left: (relativeMouseX - 16) + "px",
        top: (relativeMouseY + 16) + "px"
    });

    //On supprime tous les boutons existants avant d'en ajouter un nouveau
    $(".partial-quote").remove();

    //On ajoute/anime le bouton
    message.$msg.append($partialQuoteButton);
    SK.Util.fetchStyle($partialQuoteButton);
    $partialQuoteButton.addClass("active");

};

/* Ajoute le bloc de citation passé en paramètre au formulaire de réponse. */
SK.moduleConstructors.Quote.prototype.doQuotePost = function(citationBlock) {

    this.addToResponseThenFocus(citationBlock);
};

/* Ajoute le texte passé en paramètre à la fin de la réponse. */
SK.moduleConstructors.Quote.prototype.addToResponse = function(text) {

    var currentResponse = $("#message_topic").val();

    //On passe une ligne si la réponse n'est pas vide
    if(currentResponse.trim() !== "") {
        text = "\n" + text;

        //On en passe deux s'il n'y a pas de passage à la ligne à la fin
        if(currentResponse.slice(-1) !== "\n") {
            text = "\n" + text;
        }
    }

    $("#message_topic").val(currentResponse + text);
};

/* Crée un bloc de citation à partir du Message passées en paramètre */
SK.moduleConstructors.Quote.prototype.createCitationBlock = function(message) {

    var lines = message.text.split("\n");

    switch(this.getSetting("quoteType")) {

        case "spawnkill" :
            $.each(lines, function(i, line) {
                lines[i] = "┊ " + line;
            }.bind(this));
            lines.splice(0, 0, "┊");
            lines.splice(0, 0, "┊ " + message.permalink);
            lines.splice(0, 0, "┊ " + message.authorPseudoWithCase + ", le " +
                    message.date + " à " + message.time);
            lines.splice(0, 0, "╭");
            //Fin de la citation
            lines.push("╰");
            //On passe une ligne après la citation
            lines.push("\n");
            break;
    }

    //On n'autorise pas les sauts de ligne consécutifs dans les citations
    var quote = lines.join("\n");

    return quote;
};

/* Crée une citation dans la réponse à partir du texte passé en paramètre
 * et scroll vers la boîte de réponse. */
SK.moduleConstructors.Quote.prototype.addToResponseThenFocus = function(citationBlock) {
    this.addToResponse(citationBlock);

    var $responseBox = $("#message_topic");

    //Scrolling vers la réponse
    $responseBox.scrollThere();

    //Focus sur la réponse
    $responseBox.focusWithoutScrolling();

    //On force le curseur à la fin du textarea
    var response = $responseBox.val();
    $responseBox.val("");
    $responseBox.val(response);

    //Scroll tout en bas du textarea
    $responseBox.scrollTop($responseBox[0].scrollHeight - $responseBox.height());

};

/**
 * Retourne un bloc de citation html à partir des infos passées en paramètre
 */
SK.moduleConstructors.Quote.prototype.citationToHtml = function(pseudo, jour, mois, annee, heure, permalien, message) {

    //CDV de l'auteur cité
    var profileUrl = "http://www.jeuxvideo.com/profil/" + pseudo + "?mode=infos";

    if(heure !== "") {
        heure = "<div class='quote-hour' >" + heure + "</div>";
    }
    var $quote = $("<div class='quote-bloc' >" +
            "<div class='quote-header' >" +
                "<a class='quote-pseudo' href='" + profileUrl + "&popup=0' data-popin='" + profileUrl + "' data-popin-type='iframe' >" + pseudo + "</a>" +
                heure +
                "<div class='quote-date' >" + jour + " " + mois + " " + annee + "</div>" +
            "</div>" +
            "<hr>" +
            "<div class='quote-message' >" +
                message +
            "</div>" +
        "</div>");

    //Permalien vers le message
    if(permalien !== "") {
        $quote.find(".quote-pseudo").first().after(new SK.Button({
            class: "link-gray",
            href: permalien,
            tooltip: {
                text: "Lien vers ce message",
                position: "right"
            },
            wrapper: {
                class: "quote-link"
            }
        }));
    }

    //Popup CDV de l'auteur
    $quote.find(".quote-pseudo").first().on("click", function(event) {
        event.preventDefault();
        window.open(profileUrl, "profil", "width=800,height=570,scrollbars=no,status=no");
    });

    return $quote[0].outerHTML;
};

/* options : {
    id: nom du type de la citation
    regex: regex de reconnaissance du type de citation
    replaceCallback: callback appelé avec post.replace(regex, replaceCallback)
}*/
SK.moduleConstructors.Quote.QuoteType = function(options) {
    this.regex = options.regex;
    this.replaceCallback = options.replaceCallback;
};

/**
 * Tous les types de citations pris en compte par le plugin
 * pour le passge à l'HTML
 */
SK.moduleConstructors.Quote.prototype.quoteTypes = [];

/**
 * Prépare les styles de citations supportés
 */
SK.moduleConstructors.Quote.prototype.initQuoteTypes = function() {

    var self = this;

    self.quoteTypes.push(new SK.moduleConstructors.Quote.QuoteType({
        id: "respawn",
        /* $1: jour, $2: mois, $3: année, $4: heure, $5: message */
        regex: /<blockquote class="blockquote-jv">[^L]*Le (\d{1,2}(?:er)?) ([^\s]*) (\d{4}) à (\d{2}:\d{2}):\d{2} ([^\s]+) a écrit :((?:.|[\n\r])*)<\/blockquote>[\s]*/gm,

        replaceCallback: function(match, jour, mois, annee, heure, pseudo, message) {

            return self.citationToHtml(pseudo, jour, mois, annee, heure, "", message);
        }
    }));
};

/** Remplace les citations textes par du HTML dans le texte passé en paramètre */
SK.moduleConstructors.Quote.prototype.htmlizeQuote = function(postText) {

    var newPostText = postText;

    for(var i in this.quoteTypes) {
        newPostText = newPostText.replace(this.quoteTypes[i].regex, this.quoteTypes[i].replaceCallback);
    }

    //Si aucun remplacement n'a été fait, on a terminé.
    if(postText === newPostText) {
        return newPostText;
    }
    //Sinon, on cherche des citations un niveau plus bas
    else {
        return this.htmlizeQuote(newPostText);
    }
};

/**
 * Transforme toutes les citations textes de la page en Html
 */
SK.moduleConstructors.Quote.prototype.htmlizeAllQuotes = function() {

    var self = this;
    var $posts = $(".txt-msg.text-enrichi-forum");
    var postCount = $posts.length;

    //On remplace les citations textes par de l'Html dans tous les posts
    $posts.each(function(i, post) {

        var $post = $(post);
        self.queueFunction(function() {

            var postText = $post.html()
                //On retire les <br> pour le parsing, on les ajoutera par la suite
                .replace(/\n/g, "").replace(/[ ]*<br>/g, "\n")
                // On supprime les espaces multiples
                .replace(/[ ]+/g, " ")
            ;

            //On converti les citations en html
            postText = self.htmlizeQuote(postText);

            //On remet les <br>
            $post.html(postText.replace(/\n/g, "\n<br>"));

            if(i === postCount - 1) {
                SK.Util.dispatchEvent("betterQuoteLoaded");
            }
        }, this);
    });
};

/* Options modifiables du plugin */
SK.moduleConstructors.Quote.prototype.settings = {
    betterQuote: {
        title: "Formatage des citations",
        description: "Améliore le style des citations pour qu'elles se détachent plus du message.",
        type: "boolean",
        default: true,
    },
    partialQuote: {
        title: "Citations partielles",
        description: "Permet de ne citer qu'une partie d'un post en sélectionnant le texte avec la souris.",
        type: "boolean",
        default: true,
    }
};

SK.moduleConstructors.Quote.prototype.shouldBeActivated = function() {
    /* On affiche le bloc de citation sur la page réponse et les pages de lecture */
    return SK.Util.currentPageIn(SK.common.Pages.TOPIC_READ);
};

SK.moduleConstructors.Quote.prototype.getCss = function() {
    var css = "";

    var mainColor = SK.common.mainColor;

    if(this.getSetting("partialQuote")) {
        css += "\
            .msg .post::-moz-selection,\
            .msg .post *::-moz-selection {\
                background-color: " + mainColor + ";\
                color: #FFF;\
            }\
            .msg .post::selection,\
            .msg .post *::selection {\
                background-color: " + mainColor + ";\
                color: #FFF;\
            }\
            .partial-quote {\
                position: absolute;\
                opacity: 0.2;\
                transform: scale(0.2);\
                transition-duration: 200ms;\
                transition-property: opacity transform;\
                box-shadow: 1px 1px 2px -1px rgba(0, 0, 0, 0.5);\
                z-index: 200;\
            }\
            .partial-quote.active {\
                opacity: 1;\
                transform: scale(1);\
            }\
            .partial-quote::after {\
                content: \"\";\
                position: absolute;\
                top: -15px;\
                border: solid 8px transparent;\
                display: block;\
                border-bottom-color: " + mainColor + ";\
            }\
            .partial-quote:active::after {\
                top: -14px;\
            }\
        ";
    }

    if(this.getSetting("betterQuote")) {
        css += "\
            .quote-bloc {\
                position: relative;\
                background-color: #FFF;\
                box-shadow: 1px 1px 3px -0px rgba(0, 0, 0, 0.3);\
                border-left: solid 3px " + mainColor + ";\
                margin-bottom: 10px;\
                color: #444;\
            }\
            .quote-bloc::after {\
                content: \"\";\
                display: block;\
                width: 0px;\
                height: 0px;\
                position: absolute;\
                top: 28px;\
                left: -3px;\
                border: solid 7px transparent;\
                border-left-color: " + mainColor + ";\
            }\
            .quote-header {\
                padding: 3px 10px;\
                padding-right: 5px;\
            }\
            .quote-bloc hr {\
                display: block;\
                border: none;\
                border-bottom: solid 1px #E0E0E0;\
                margin: 0 5px;\
                margin-left: 10px;\
                height: 0px;\
            }\
            .quote-pseudo {\
                display: inline-block;\
                font-weight: bold;\
                color: #444;\
            }\
            .quote-pseudo:hover {\
                color: " + mainColor + ";\
            }\
            .quote-date {\
                float: right;\
                display: inline-block;\
                position: relative;\
                top: 1px;\
                padding-left: 18px;\
                font-size: 0.9em;\
                background-image: url('" + GM_getResourceURL("calendar") + "');\
                background-position: 1px -1px;\
                background-repeat: no-repeat;\
            }\
            .quote-hour {\
                float: right;\
                display: inline-block;\
                position: relative;\
                top: 1px;\
                padding-left: 26px;\
                font-size: 0.9em;\
                background-image: url('" + GM_getResourceURL("clock") + "');\
                background-position: 10px -1px;\
                background-repeat: no-repeat;\
            }\
            .quote-message {\
                padding: 5px;\
                padding-left: 10px;\
                min-height: 10px;\
            }\
            .quote-bloc .sk-button.quote-link {\
                float: right;\
                margin-left: 8px;\
            }\
            .sk-button-content.link-gray {\
                background-image: url('" + GM_getResourceURL("link-gray") + "');\
                background-color: transparent;\
                border-bottom-color: transparent;\
            }\
        ";
    }

    return css;
};
