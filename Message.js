"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Représente un post JVC (.msg) */
SK.Message = function($msg) {

    this.$msg = $msg;
    this.text = "";
    this.authorPseudoWithCase = "";
    this.authorPseudo = "";
    this.date = "";
    this.time = "";
    this.permalink = "";
    this.author = null;
    this.init();
};


SK.Message.prototype.init = function() {

    /* Récupère le texte présent dans le post $(.msg) passé en paramètre
    * Note : remplace les images par leur attribut alt */
    var $message = this.$msg.find(".text-enrichi-forum").clone();

    //On supprime les éventuelles citations
    $message.find(".quote-bloc").remove();

    //On supprime les éventuels boutons de téléchargement
    $message.find(".spawnkill-media-element").remove();

    //On remplace les smileys par des alt
    $message.find("> img").each(function() {
        $(this).replaceWith(this.alt);
    });

    this.text = $message.text().trim();

    /* Retourne le permalien du post */
    this.permalink = location.protocol + "//" + location.host + location.pathname + "#" + this.$msg.attr("id");

    this.authorPseudoWithCase = this.$msg.find(".bloc-pseudo-msg").first().text().trim();
    this.authorPseudo = this.authorPseudoWithCase.toLowerCase();

    /* Retourne la date du post  */
    var $dateBloc = this.$msg.find(".lien-jv");
    var dateString = $dateBloc.text().trim();

    var match = dateString.match(/[\s]*(\d{1,2}(?:er)? [^\s]* \d{4}) à (\d{2}:\d{2}:\d{2})/);
    this.date = match[2];
    this.time = match[3];
};

SK.Message.prototype.setAuthor = function(author) {
    this.author = author;
};
