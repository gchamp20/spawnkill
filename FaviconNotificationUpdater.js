"use strict";

/**
 * Permet d'ajouter et de mettre à jour une notification dans le favicon.
 */
SK.FaviconNotificationUpdater = function(baseFaviconUrl) {

    //Objet jQuery de l'élément <link> du favicon
    this.$faviconLink = null;
    this.baseFaviconUrl = baseFaviconUrl;

    //Création du canvas
    this.canvas = $("<canvas>").get(0);
    this.canvas.width = 16;
    this.canvas.height = 16;

    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "10px Verdana";
    this.ctx.textBaseline = "bottom";

    this.img = new Image();

    /**
     * Affiche une notification d'erreur dans le favicon (une croix)
     * @param {string} color Du type #123456 Couleur du background de la notification (gris par défaut).
     */
    this.showFaviconError = function(color) {

        color = color || "#666";
        var crossCharacter = "\u2a2f";

        this.showFaviconNotification(crossCharacter, color);
    };

    /**
     * Met à jour le favicon avec une notification (nombre)
     * @param {int} count Valeur à afficher (max 99)
     * @param {string} color Du type #123456 Couleur du background de la notification (rouge par défaut).
     */
    this.showFaviconCount = function(count, color) {

        if(isNaN(count)) {
            return;
        }

        color = color || "#D62222";

        //On limite le nombre à 99
        count = Math.min(99, count);

        this.showFaviconNotification(count, color);
    };

    /**
     * Met à jour le favicon avec une notification
     * @param {string} text Texte à afficher dans le favicon (maximum deux caractères)
     * @param {string} color Du type #123456 Couleur du background de la notification.
     */
    this.showFaviconNotification = function(text, color) {

        $(this.img).on("load", function() {

            //On reset le canvas
            this.ctx.clearRect(0, 0, 16, 16);

            //On ajoute le text à l'icône
            var textWidth = this.ctx.measureText(text).width;
            this.ctx.drawImage(this.img, 0, 0);
            this.ctx.fillStyle = color;
            this.ctx.fillRect(0, 0, textWidth + 3, 11);
            this.ctx.fillStyle = "#FFF";
            this.ctx.fillText(text, 1, 11);

            var faviconDataUrl = this.canvas.toDataURL("image/png");

            //On remplace le favicon
            if(this.$faviconLink !== null) {
                this.$faviconLink.remove();
            }

            this.$faviconLink = $("<link>", {
                href: faviconDataUrl,
                rel: "shorcut icon",
                type: "image/png"
            });

            $("head").append(this.$faviconLink);

        }.bind(this));

        //Récupération du favicon
        this.img.src = this.baseFaviconUrl;
    };
};