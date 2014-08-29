"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * EmbedMedia : Remplace les liens vers une vidéo YouTube par la vidéo elle-même.
 */
SK.moduleConstructors.EmbedMedia = SK.Module.new();

SK.moduleConstructors.EmbedMedia.prototype.id = "EmbedMedia";
SK.moduleConstructors.EmbedMedia.prototype.title = "Intégration de contenus";
SK.moduleConstructors.EmbedMedia.prototype.description = "Remplace les liens vers les images, vidéos, sondages ou vocaroo par le contenu lui-même.";

SK.moduleConstructors.EmbedMedia.prototype.init = function() {
    this.initMediaTypes();

    //Si htmlQuote est activé, on a besoin que les citations soient chargées pour calculer la taille des vidéos
    var mustWaitQuote = SK.modules.Quote.activated && SK.modules.Quote.getSetting("htmlQuote");
    SK.Util.bindOrExecute(mustWaitQuote, "htmlQuoteLoaded", function() {
        this.embedMedia();
    }.bind(this));

    this.userSettings = {};

    //On récupère le paramètre optin
    this.userSettings.optinEmbed = this.getSetting("optinEmbed");

    //Et les paramètres de chaque type de media pour éviter les appels trop fréquents au localStorage
    for(var i in this.settings) {
        var settingId = i;
        this.userSettings[settingId] = this.getSetting(settingId);
    }

};

/* options : {
    id: nom du type de media
    regex: regex de reconnaissance du lien
    addHideButton: si vrai, un bouton pour cacher le media sera affiché
    hideButtonText: texte au survol du bouton de masquage
    showButtonText: texte au survol du bouton d'affichage
    settingId: id du paramètre gérant le media
    getEmbeddedMedia: callback appelé avec getEmbeddedMedia($a, link.match(regex)), retourne l'élément jQuery qui remplace le lien
}*/
SK.moduleConstructors.EmbedMedia.MediaType = function(options) {
    this.id = options.id;
    this.regex = options.regex;
    this.addHideButton = options.addHideButton;
    this.hideButtonText = options.hideButtonText;
    this.showButtonText = options.showButtonText;
    this.settingId = options.settingId;
    this.getEmbeddedMedia = options.getEmbeddedMedia;
};

/**
 * Tous les types de media pris en compte par le plugin
 */
SK.moduleConstructors.EmbedMedia.prototype.mediaTypes = [];

/**
 * Prépare les styles de media supportés
 */
SK.moduleConstructors.EmbedMedia.prototype.initMediaTypes = function() {

    //Images
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "image",
        settingId: "embedImages",

        /*
         * match :
         * http://www.hapshack.com/?v=kCIu0.png
         * http://www.noelshack.com/2014-33-1408191836-vimeo.png
         * ne match pas :
         * https://www.dropbox.com/s/lfta3yd9tryotxp/screen2.png
         * http://www.hostingpics.net/viewer.php?id=785683.jpg
         */
        regex: /^https?:\/\/(?!www\.dropbox\.com|www\.hostingpics)(?:(?:(www\.hapshack\.com\/\?v=)|(www\.noelshack\.com\/([\d]{4})-([\d]{2})-))?(.*.(jpe?g|png|gif)))$/,

        addHideButton: true,
        showButtonText: "Afficher les images",
        hideButtonText: "Masquer les images",

        getEmbeddedMedia: function($a, match) {

            var imageLink = match[0];

            //Prise en compte des images Noelshack
            if(typeof match[2] != "undefined") {
                imageLink = "http://image.noelshack.com/fichiers/" + match[3] + "/" + match[4] + "/" + match[5];
            }

            //Prise en compte d'Hapshack
            else if(typeof match[1] != "undefined") {
                imageLink = "http://www.hapshack.com/images/" + match[5];
            }

            var $el = $("<a>", {
                href: imageLink,
                target: "_blank"
            });

            $el.html($("<img>", {
                src: imageLink,
                title: " ",
                alt: imageLink, //Obligatoire pour que les citations partielles fonctionnent avec les images
                "data-popin": imageLink,
                "data-popin-type": "image"
            }));

            return $el;
        }

    }));

    //Youtube
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "youtube",
        settingId: "embedVideos",

        // http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url
        /* $1: youtubeId */
        regex: /^https?:\/\/(?:(?:www)?m?\.)?youtu.*(?:\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^\s^#\&\?]*).*/,

        addHideButton: true,
        showButtonText: "Afficher les vidéos Youtube",
        hideButtonText: "Masquer les vidéos Youtube",

        getEmbeddedMedia: function($a, match) {

            /**
             * Retourne une version "embed" du lien, sinon null.
             */
            var getEmbedUrl = function(youtubeId) {
                return "http://www.youtube.com/embed/" + youtubeId;
            };

            /**
             * Fonction qui crée l'élément à intégrer à la page.
             */
            var createVideoElement = function (youtubeLink) {
                var ratio = 16 / 9;
                var videoWidth = $a.closest(".quote-message, .post").width() - 5;
                var videoHeight = videoWidth / ratio;

                var $el = $("<iframe>", {
                   src: youtubeLink,
                   width: videoWidth,
                   height: videoHeight,
                   allowfullscreen: 1,
                   frameborder: 0,
                });

                return $el;
            };

            if (match[1].length === 11) {
                var youtubeLink = getEmbedUrl(match[1]);
                return createVideoElement(youtubeLink);
            }
            else {
                return null;
            }
        }

    }));

    //Vocaroo
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "vocaroo",
        settingId: "embedRecords",

        regex: /^http:\/\/vocaroo\.com\/i\/(.*)$/,

        addHideButton: true,
        showButtonText: "Afficher les Vocaroos",
        hideButtonText: "Masquer les Vocaroos",

        getEmbeddedMedia: function($a, match) {

            var vocarooId = match[1];
            var $el = $("\
                <object width='148' height='44'>\
                    <param name='movie' value='http://vocaroo.com/player.swf?playMediaID=" + vocarooId + "&autoplay=0'></param>\
                    <param name='wmode' value='transparent'></param>\
                    <embed src='http://vocaroo.com/player.swf?playMediaID=" + vocarooId + "&autoplay=0' width='148' height='44'\
                        wmode='transparent' type='application/x-shockwave-flash'>\
                    </embed>\
                </object>\
            ");
            return $el;
        }

    }));

    //Pixule
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "pixule",
        settingId: "embedSurveys",

        regex: /^http:\/\/www\.pixule\.com\/(?:sondages\/[^\/]*\/)?([\d]*).*$/,

        addHideButton: true,
        showButtonText: "Afficher les sondages Pixule",
        hideButtonText: "Masquer les sondages Pixule",

        getEmbeddedMedia: function($a, match) {

            //On ne remplace pas les sondages dans les citations
            if($a.parents(".quote-message").length > 0) {
                return null;
            }
            else {
                var pixuleId = match[1];
                var sondageLink = "http://www.pixule.com/widget" + pixuleId;

                var $el = $("<iframe>", {
                   src: sondageLink,
                   "data-key": pixuleId,
                   width: 370,
                   height: 365,
                   frameborder: 0,
                   scrolling: "no",
                   allowtransparency: "true",
                });

                return $el;
            }
        }

    }));

    //Sondage.io
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "sondageio",
        settingId: "embedSurveys",

        regex: /^http:\/\/sondage\.io\/([\d]*).*$/,

        addHideButton: true,
        showButtonText: "Afficher les sondages Sondage.io",
        hideButtonText: "Masquer les sondages Sondage.io",

        getEmbeddedMedia: function($a, match) {


            //On ne remplace pas les sondages dans les citations
            if($a.parents(".quote-message").length > 0) {
                return null;
            }
            else {
                var sondageLink = match[0];
                var sondageWidth = Math.min(400, $a.parents(".post").width() - 5);
                var sondageHeight = 300;

                var $el = $("<iframe>", {
                   src: sondageLink,
                   width: sondageWidth,
                   height: sondageHeight,
                   frameborder: 0,
                });

                return $el;
            }
        }

    }));

    //DailyMotion
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "dailymotion",
        settingId: "embedVideos",

        regex: /^http:\/\/www\.dailymotion\.com\/video\/([^_]*)/,

        addHideButton: true,
        showButtonText: "Afficher les vidéos DailyMotion",
        hideButtonText: "Masquer les vidéos DailyMotion",

        getEmbeddedMedia: function($a, match) {
            var dailymotionId = match[1];
            var dailymotionLink = "http://www.dailymotion.com/embed/video/" + dailymotionId;
            var ratio = 16 / 9;
            var videoWidth = $a.closest(".quote-message, .post").width() - 5;
            var videoHeight = videoWidth / ratio;

            var $el = $("<iframe>", {
               src: dailymotionLink,
               width: videoWidth,
               height: videoHeight,
               allowfullscreen: 1,
               frameborder: 0,
            });

            return $el;
        }

    }));

    //Vimeo
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "vimeo",
        settingId: "embedVideos",

        regex: /^http:\/\/vimeo.com\/(\d*)/,

        addHideButton: true,
        showButtonText: "Afficher les vidéos Vimeo",
        hideButtonText: "Masquer les vidéos Vimeo",

        getEmbeddedMedia: function($a, match) {
            var vimeoId = match[1];
            var vimeoLink = "http://player.vimeo.com/video/" + vimeoId + "?title=0&byline=0&portrait=0&color=20B9EB";
            var ratio = 16 / 9;
            var videoWidth = $a.closest(".quote-message, .post").width() - 5;
            var videoHeight = videoWidth / ratio;

            var $el = $("<iframe>", {
               src: vimeoLink,
               width: videoWidth,
               height: videoHeight,
               allowfullscreen: 1,
               frameborder: 0,
            });

            return $el;
        }

    }));

    //Lien Télécharger SpawnKill
    this.mediaTypes.push(new SK.moduleConstructors.EmbedMedia.MediaType({

        id: "spawnkill",
        settingId: "embedSpawnKill",

        regex: /^http:\/\/dl\.spixel\.fr\/get-spawnkill\/?#download-box$/,

        addHideButton: false,

        getEmbeddedMedia: function() {

            var $el = $("<div>");
            var donationLabels = [
                "Nourrir mon chat <img alt=':hap:' src='http://image.jeuxvideo.com/smileys_img/18.gif'>",
                "Me payer une gauffre",
                "Me payer une bière",
                "Me payer l'apéro",
                "Me payer un kebab",
                "Me payer un coca",
                "Me payer une clope",
                "M'acheter des chewing-gums",
                "M'acheter des bonbons",
                "M'acheter une pizza",
                "M'offrir un Humble Bundle",
                "Payer une partie du serveur",
                "M'offrir un café",
                "Nourrir un développeur"
            ];
            var donationLabel = donationLabels[Math.floor(Math.random() * donationLabels.length)];


            $el.append(new SK.Button({
                class: "spawnkill-button large",
                text: "Télécharger SpawnKill",
                href: "http://dl.spixel.fr/get-spawnkill/#download-box",
                target: "_blank",
                tooltip: {
                    position: "bottom large",
                    text: "Télécharger et Installer SpawnKill"
                },
                wrapper: {
                    class: "spawnkill-wrapper"
                }
            }));

            var $donationButton = new SK.Button({
                class: "spawnkill-button large minor",
                html: donationLabel,
                tooltip: {
                    position: "bottom large",
                    text: "Faire un don de 2€ à Spixel_"
                },
                click: function() {
                    $(this).parents("form").first().submit();
                }
            });

            $el.append("<span class='or' >ou</span>");
            $el.append("<form target='_blank' class='donation-form' action='https://www.paypal.com/cgi-bin/webscr' method='post' target='_top'>\
                <input type='hidden' name='cmd' value='_donations'>\
                <input type='hidden' name='business' value='LHTF3GZ496X8U'>\
                <input type='hidden' name='lc' value='FR'>\
                <input type='hidden' name='item_name' value='Dorian Marchal'>\
                <input type='hidden' name='amount' value='2.00'>\
                <input type='hidden' name='currency_code' value='EUR'>\
                <input type='hidden' name='bn' value='PP-DonationsBF:1408178230-capture-du-2014-08-16-10-33-38.jpg:NonHostedGuest'>\
                <img alt=' border='0' src='https://www.paypalobjects.com/fr_FR/i/scr/pixel.gif' width='1' height='1'>\
                </form>\
            ");

            $el.find("[name=bn]").after($donationButton);

            return $el;
        }

    }));

};

/**
 * Parcourt tous les liens des posts à la recherche de contenu à intégrer.
 */
SK.moduleConstructors.EmbedMedia.prototype.embedMedia = function() {

    var self = this;
    
    /**
     * Fonction qui ajoute le bouton afficher/masquer les media d'un post.
     */
    var addToggleMediaButton = function($msg, mediaType, actionShow) {

        var dataAction = actionShow ? "show" : "hide";
        var tooltipText = actionShow ? mediaType.showButtonText : mediaType.hideButtonText;

        SK.Util.addButton($msg, {
            location: "right",
            "data-media-id": mediaType.id,
            "data-action": dataAction,
            tooltip: {
                text: tooltipText,
                position: "top"
            },
            click: function() {
                var $button = $(this);
                var mediaId = $button.attr("data-media-id");
                var show = $button.attr("data-action") === "show";

                //On change l'état du bouton
                if(show) {
                    $button.attr("data-action", "hide")
                           .siblings(".tooltip").html(mediaType.hideButtonText);
                }
                else {
                    $button.attr("data-action", "show")
                           .siblings(".tooltip").html(mediaType.showButtonText);
                }

                //On affiche/cache les medias
                $msg.find("." + mediaId + "-media-element").toggle();
                $msg.find("." + mediaId + "-media-link").toggle();

                //On enregistre l'état dans le localStorage
                SK.Util.setValue($msg.attr("id") + "." + mediaId +".show", show);

            }
        });
    };
        
    /**
     * Lie un contenu au lien s'il match un type de media
     */
    var queueCheckLinkForMedia = function($msg, $a) {

        self.queueFunction(function() {

            var messageId = $msg.attr("id");

            for(var i in self.mediaTypes) {

                var mediaType = self.mediaTypes[i];

                //On intégre seulement les medias activés
                if(self.userSettings[mediaType.settingId]) {

                    var matchMedia = $a.attr("href").match(mediaType.regex);

                    // Vrai si le media doit être affiché au chargement, on récupère les infos dans le localStorage
                    var showMedia = SK.Util.getValue(messageId + "." + mediaType.id +".show");

                    //On cache tous les medias des citations, par défaut
                    if($a.parents(".quote-message").length > 0) {
                        showMedia = false;
                    }

                    if(showMedia === null) {
                        showMedia = !self.userSettings.optinEmbed;
                    }

                    if (matchMedia) {
                        
                        //On remplace le lien par l'élément du media
                        var $mediaElement = mediaType.getEmbeddedMedia($a, matchMedia);

                        if($mediaElement !== null) {

                            $a.after($mediaElement);
                            $mediaElement.addClass(mediaType.id + "-media-element media-element");
                            $a.addClass(mediaType.id + "-media-link");

                            if(showMedia) {
                                $a.hide();
                            }
                            else {
                                $mediaElement.hide();
                            }

                            //Si besoin, on ajoute une seule fois  un bouton pour masquer/afficher le media
                            if(mediaType.addHideButton && $msg.find("[data-media-id='" + mediaType.id + "']").length === 0) {
                                addToggleMediaButton($msg, mediaType, !showMedia);
                            }
                        }

                        break;
                    }
                }
            }

        }, this);

    };

    /**
     * Parcourt des posts à la recherche de medias à intégrer,
     * remplacement des liens pas l'intégration du media correspondant
     *  et ajout d'un bouton masquer/afficher au post si nécessaire.
     */
    $(".msg").each(function(id, msg) {

        var $msg = $(msg);

        //On parcourt tous les liens du post
        $msg.find(".post a").each(function(id, a) {

            //Et on cherche chaque type de media
            queueCheckLinkForMedia($msg, $(a));
            
        });
    });
};

SK.moduleConstructors.EmbedMedia.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn([ "topic-read", "topic-response", "post-preview" ]);
};

SK.moduleConstructors.EmbedMedia.prototype.settings = {
    optinEmbed: {
        title: "Masquer les contenus par défaut",
        description: "Cache le contenu par défaut, il faut d'abord cliquer sur le bouton pour le faire apparaître.",
        type: "boolean",
        default: false,
    },
    embedVideos: {
        title: "Intégration des vidéos",
        description: "Intégre les vidéos Youtube, DailyMotion et Vimeo aux posts.",
        type: "boolean",
        default: true,
    },
    embedImages: {
        title: "Intégration des images",
        description: "Intégre les images PNG, JPG et GIF aux posts.",
        type: "boolean",
        default: true,
    },
    embedSurveys: {
        title: "Intégration des sondages",
        description: "Intégre les sondages Pixule et Sondage.io aux posts.",
        type: "boolean",
        default: true,
    },
    embedRecords: {
        title: "Intégration des Vocaroos",
        description: "Intégre les enregistrements Vocaroo aux posts.",
        type: "boolean",
        default: true,
    },
    embedSpawnKill: {
        title: "Bouton de téléchargement SpawnKill",
        description: "Affiche un bouton à la place du lien de téléchargement SpawnKill",
        type: "boolean",
        default: true,
    }
};

SK.moduleConstructors.EmbedMedia.prototype.getCss = function() {
    var css = "\
        [data-media-id='image'] {\
            background-color: #FFB82B;\
            border-bottom-color: #C48B21;\
            background-image: url('" + GM_getResourceURL("image") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='youtube'] {\
            background-color: #E62117;\
            border-bottom-color: #9B140F;\
            background-image: url('" + GM_getResourceURL("youtube") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='vimeo'] {\
            background-color: #20B9EB;\
            border-bottom-color: #167E9E;\
            background-image: url('" + GM_getResourceURL("vimeo") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='dailymotion'] {\
            background-color: #0072AF;\
            border-bottom-color: #002438;\
            background-image: url('" + GM_getResourceURL("dailymotion") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='pixule'] {\
            background-color: #B9E04E;\
            border-bottom-color: #809B36;\
            background-image: url('" + GM_getResourceURL("sondageio") + "');\
            background-position: 0px 0px;\
        }\
        [data-media-id='vocaroo'] {\
            background-color: #B1DB69;\
            border-bottom-color: #789346;\
            background-image: url('" + GM_getResourceURL("vocaroo") + "');\
            background-position: 0px -1px;\
        }\
        [data-media-id='sondageio'] {\
            background-color: #FF7B3B;\
            border-bottom: solid 2px #BC3800;\
            background-image: url('" + GM_getResourceURL("sondageio") + "');\
            background-position: 0px 0px;\
        }\
        .donation-form {\
            display: inline-block;\
        }\
        .spawnkill-media-element .sk-button {\
            vertical-align: top;\
        }\
        .spawnkill-media-element .or {\
            margin-left: 8px;\
            margin-right: 3px;\
            position: relative;\
            top: 6px;\
        }\
        .sk-button-content[data-action=show] {\
            background-color: #A3A3A3;\
            border-bottom-color: #525252;\
        }\
        .spawnkill-media-element {\
            display: block !important;\
        }\
        .spawnkill-wrapper {\
            margin-left: 0px;\
        }\
        .sondageio-media-element {\
            margin: 5px;\
            margin-left: 0px;\
            border: solid 1px #CCC;\
            border-radius: 5px;\
        }\
        .media-element {\
            margin: 10px 5px;\
            margin-left: 0px;\
        }\
        .image-media-element {\
            display: block;\
            width: calc(100% - 5px);\
            margin: 5px;\
            margin-left: 0px;\
        }\
        .image-media-element img {\
            max-width: 100%;\
        }\
    ";

    return css;
};