"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Représente un post JVC (.msg) */
SK.Message = function($msg) {

    this.$msg = $msg;
    this.text = "";
    this.authorPseudo = "";
    this.date = "";
    this.time = "";
    this.permalink = "";
    this.alertUrl = "";
    this.author = null;
    this.init();
};


SK.Message.prototype.init = function() {

    /* Récupère le texte présent dans le post $(.msg) passé en paramètre 
    * Note : remplace les images par leur attribut alt */
    var $message = this.$msg.find(".post").clone();

    //On supprime les éventuelles citations
    $message.find(".quote-bloc").remove();

    $message.find("> img").each(function() {
        $(this).replaceWith($(this).attr("alt"));
    });

    this.text = $message.text().trim();

    /* Retourne le permalien du post */
    this.permalink = location.protocol + "//" + location.host + location.pathname + "#" + this.$msg.attr("id");

    /* Retourne le pseudo de l'auteur du post  */
    this.alertUrl = this.$msg.find("[target=avertir]").first().attr("href");
    
    this.authorPseudo = this.$msg.find(".pseudo > strong").first().html().trim();

    /* Retourne la date du post  */
    var $dateBloc = this.$msg.find(".date");
    var dateString = $dateBloc.text().trim();

    var match = dateString.match(/Posté (via mobile )?le[\s]*(\d{1,2} [^\s]* \d{4}) à (\d{2}:\d{2}:\d{2})/);
    this.date = match[2];
    this.time = match[3];
};

SK.Message.prototype.setAuthor = function(author) {
    this.author = author;
};