"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

SK.moduleConstructors.InfosPseudo = SK.Module.new();

SK.moduleConstructors.InfosPseudo.prototype.id = "InfosPseudo";
SK.moduleConstructors.InfosPseudo.prototype.title = "Avatars et autres infos";
SK.moduleConstructors.InfosPseudo.prototype.description = "Affiche les avatars des membres à gauche des posts ainsi que leur rangs et leur sexe. Ajoute aussi des boutons pour envoyer un MP ou copier le lien permanent.";

/** Calcule la taille de l'avatar avant le chargement du CSS */
SK.moduleConstructors.InfosPseudo.prototype.beforeInit = function() {
    this.avatarSize = parseInt(this.getSetting("avatarSize"));
};

SK.moduleConstructors.InfosPseudo.prototype.init = function() {

	if(SK.Util.currentPageIn(["topic-list"])) {
		
		this.getAuthorsTopics();
		
	} else {
	
		this.addPostInfos();

		if (this.getSetting("enableUserHighlight")) {
			//On attend quelques secondes que le pseudo soit chargé en Ajax
			//Sale mais sera modifié avec l'arrivée de SpawnKill
			window.setTimeout(function() {
				this.highlightCurrentUser();
			}.bind(this), 1000);
		}
		
		if (!SK.Util.currentPageIn(["post-preview"])) {
			if (this.getSetting("enableAuthorHighlight")) {
				//On attend quelques secondes que le pseudo soit chargé en Ajax
				//Sale mais sera modifié avec l'arrivée de SpawnKill
				window.setTimeout(function() {
					this.highlightCurrentAuthor();
				}.bind(this), 1000);
			}
		}
	}
};

/* Taille des avatars en pixels */
SK.moduleConstructors.InfosPseudo.prototype.avatarSize = 0;

/** Retourne un entier sur [1 ; 151] */
SK.moduleConstructors.InfosPseudo.prototype.getRandomPokemon = function() {
    return ("00" + Math.floor((Math.random() * 151) + 1)).slice(-3);
};

/** Récupère et stocke les auteurs associés aux topics de la page. */
SK.moduleConstructors.InfosPseudo.prototype.getAuthorsTopics = function() {
     
    var currentForum = document.URL.split("-")[1];
	
	$(".ltopic").each(function() {
		
		var $topicId = $(this).attr("href").split("-")[2];
		var $key = currentForum + "." + $topicId;
		
		if (SK.Util.getValue($key) == null) {
			var $authorTopic = $(this).parent().parent().find(".pseudo").text().toLowerCase();
			SK.Util.setValue($key, $authorTopic, true);
		}
		
	});
	
};

/** Ajoute les infos à tous les posts */
SK.moduleConstructors.InfosPseudo.prototype.addPostInfos = function() {

    var self = this;

    //:not(.lecture_msg) evite les MP
    if($(":not(.lecture_msg) .msg").length > 0) {

        //Auteurs dont on n'a pas les données
        var toLoadAuthors = [];
        var toLoadAuthorPseudos = [];

        //Auteurs sur la page
        var authors = {};
        
        //On parcourt tous les messages
        $(".msg .pseudo").each(function() {

            self.queueFunction(function() {
                var $msg = $(this).parents(".msg").first();
                
                //On crée le Message
                var message = new SK.Message($msg);

                //Ajout du placeholder de l'avatar
                if(self.getSetting("enableAvatar")) {

                    self.addAvatarPlaceholder(message);
                }

                //On récupère l'auteur correspondant au post
                if(typeof authors[message.authorPseudo] === "undefined") {
                    authors[message.authorPseudo] = new SK.Author(message.authorPseudo);
                    authors[message.authorPseudo].loadLocalData();
                }
                var author = authors[message.authorPseudo];
                author.addMessage(message);


                //Et on l'ajoute au message
                message.setAuthor(author);

                //On affiche les données des auteurs qu'on a en localStorage
                if(author.hasLocalData) {
                    self.showMessageInfos(message);
                }
                else {

                    //On conserve les auteurs dont on n'a pas les données
                    if(toLoadAuthorPseudos.indexOf(message.authorPseudo) === -1) {
                        toLoadAuthors.push(author);
                        toLoadAuthorPseudos.push(message.authorPseudo);
                    }
                }
            }, this);

        });

        //On récupères les infos des auteurs dont on n'a pas les données
        self.queueFunction(function() {
            var queueInitAuthor = function(author, $cdv) {
                setTimeout(function() {

                    author.initFromCdv($cdv);
                    //On enregistre les données dans le localStorage
                    author.saveLocalData();

                    for(var message in author.messages) {
                        self.showMessageInfos(author.messages[message]);
                    }
                }, 0);
            };

            //On récupère les infos des auteurs périmées ou qu'on n'a pas encore dans le localStorage
            if(toLoadAuthorPseudos.length > 0) {
                SK.Util.api("pseudos", toLoadAuthorPseudos, function($api) {
                    $api.find("author").each(function() {
                        var $author = $(this);
                        var pseudo = $author.attr("pseudo");
                        var $cdv = $author.find("cdv");
                        var author = authors[pseudo];
                        queueInitAuthor(author, $cdv);
                    });
                });
            }
        }, this);
    }
};

/** Affiche les infos du post et de l'auteur au message */
SK.moduleConstructors.InfosPseudo.prototype.showMessageInfos = function(message) {

    var self = this;

    if(self.getSetting("enableAvatar")) {
        self.addAvatar(message);
    }
    if(self.getSetting("enableRank")) {
        self.addRank(message);
    }
    self.addPostButtons(message);
};


/** Ajoute les différents boutons et remplace ceux par défaut */
SK.moduleConstructors.InfosPseudo.prototype.addPostButtons = function(message) {

    var self = this;
    var permalink = message.permalink;
    var avertirUrl = message.alertUrl;
    var profileUrl = "http://www.jeuxvideo.com/profil/" + message.authorPseudo + ".html";
    var mpUrl = "http://www.jeuxvideo.com/messages-prives/nouveau.php?all_dest=" + message.authorPseudo;
    var topicsUrl = "http://www.jeuxvideo.com/forums/0-" + permalink.split("-")[1] + "-0-1-0-1-1-%22" +
            message.authorPseudo + "%22.htm";

    //Bouton CDV
    var profileButtonOptions = {
        class: (message.author.gender && this.getSetting("enableSex")) ? message.author.gender : "unknown",
        href: profileUrl,
        tooltip: {
            text: "Voir la carte de visite"
        },
        click: function(event) {

            event.preventDefault();
            //On ne bloque pas le Ctrl + Clic et le middle clic
            if(!event.ctrlKey && event.which !== 2) {

                //On n'ouvre la popup que si l'option modalProfile est désactivée
                if(!self.getSetting("modalProfile")) {

                    window.open(profileUrl, "profil", "width=800,height=570,scrollbars=no,status=no");
                }
            }
            else {
                window.open(profileUrl, "_blank");
            }
        }
    };

    //Si l'option est activée, la CDV s'affichera dans une popin
    if(this.getSetting("modalProfile")) {
        profileButtonOptions["data-popin"] = profileUrl;
        profileButtonOptions["data-popin-type"] = "iframe";
        profileButtonOptions.title = " ";
        profileButtonOptions.href += "?popup=0";
    }

    SK.Util.addButton(message.$msg, profileButtonOptions);

    //Bouton Avertir
    if(this.getSetting("enableAlert")) {
        SK.Util.addButton(message.$msg, {
            class: "alert",
            location: "right",
            index: 100,
            href: avertirUrl,
            tooltip: {
                text: "Avertir un administrateur"
            },
            click: function(event) {
                event.preventDefault();
                window.open(avertirUrl, "avertir", "width=700,height=470,scrollbars=no,status=no");
            }
        });
    }

    //Bouton MP
    if(this.getSetting("enableMP")) {
        SK.Util.addButton(message.$msg, {
            class: "mp",
            href: mpUrl,
            tooltip: {
                text: "Envoyer un MP"
            },
            click: function(event) {
                event.preventDefault();
                var win = window.open(mpUrl, "_blank");
                win.focus();
            }
        });
    }

    //Bouton rechercher topics
    if(this.getSetting("enableSearchTopics")) {
        SK.Util.addButton(message.$msg, {
            class: "searchTopics",
            href: topicsUrl,
            tooltip: {
                text: "Rechercher les topics de " + message.authorPseudo 
            },
            click: function(event) {
                event.preventDefault();
                var win = window.open(topicsUrl, "_blank");
                win.focus();
            }
        });
    }
    
    //Bouton permalien
    if(this.getSetting("enablePermalinkAnchor")) {
        SK.Util.addButton(message.$msg, {
            class: "anchor",
            location: "bottom",
            href: permalink,
            tooltip: {
                text: "Ancre du message"
            }
        });
    }

    //Bouton permalien
    if(this.getSetting("enablePermalink")) {
        SK.Util.addButton(message.$msg, {
            class: "link",
            location: "bottom",
            href: permalink,
            tooltip: {
                text: "Copier le permalien"
            },
            click: function(event) {
                event.preventDefault();
                GM_setClipboard(permalink);
            }
        });
    }

    //Supprimer boutons par défaut
    message.$msg.find("[target='avertir'], .ancre > a:first, [target='profil']").remove();
};

/** Préparer une place pour l'avatar de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addAvatarPlaceholder = function(message) {

    //On ajoute déjà le wrapper de l'avatar
    var $avatarWrapper = $("<div />", {
        class: "avatar-wrapper",
    });

    //Lien vers la CDV
    var $avatar = $("<a />", {
        class: "avatar"
    });

    $avatarWrapper.append($avatar);
    message.$msg.append($avatarWrapper);
};

/* Ajoute le rang de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addRank = function(message) {

    if(message.author.rank !== "") {

        var rankString = "Rang " + message.author.rank.charAt(0).toUpperCase() + message.author.rank.slice(1);

        //Si l'avatar est pas disponible et que le rang doit être positionné sur l'avatar
        if(this.getSetting("enableAvatar") && this.getSetting("rankLocation") === "avatar") {
            
            var $rank = $("<span />", {
                class: "rank " + message.author.rank,
                title: rankString
            });
            var $avatarWrapper = message.$msg.find(".avatar-wrapper");
            $avatarWrapper.append($rank.hide().fadeIn());
        }
        else {
            SK.Util.addButton(message.$msg, {
                class: "rank " + message.author.rank,
                tooltip: {
                    text: rankString
                }
            });
        }

    }
};

/** Remplace le loader de l'avatar du post par l'image de l'auteur */
SK.moduleConstructors.InfosPseudo.prototype.addAvatar = function(message) {

    var $avatarWrapper = message.$msg.find(".avatar-wrapper");
    var $avatar = $avatarWrapper.find(".avatar");

    var $avatarImg = $("<img />", {
        title: message.authorPseudo,
        alt: message.authorPseudo,
    });

    //Si la cdv n'est pas disponible
    if(message.author.profileUnavailable) {

        $avatar.css("cursor", "default");
        //ban
        if(message.author.errorType === "ban def" || message.author.errorType === "ban tempo") {
            message.author.avatar = "http://www.serebii.net/battletrozei/pokemon/" + this.getRandomPokemon() + ".png";
            $avatar.addClass(message.author.errorType);
        }
        //Autre erreur
        else {
            message.author.avatar = GM_getResourceURL("error");
        }

            
    }
    else {
        //On ajoute pas le lien vers l'image si l'auteur est banni
        $avatarImg
            .attr("data-popin", message.author.fullSizeAvatar)
            .attr("data-popin-type", "image");
        $avatar.attr("href", message.author.fullSizeAvatar);
    }


    $avatarImg.hide();

    //Au chargement de l'avatar
    $avatarImg.on("load", function() {
        
        //On n'execute pas l'événement si l'avatar est l'image d'erreur
        if($avatar.attr("data-error") !== "1") {

            $avatar.append($avatarImg);

            $avatarImg.fadeIn(function() {
                message.$msg.addClass("not-loading");
            });
            this.resizeAndCenterAvatar($avatarImg);
        }

    }.bind(this));

    //Si l'avatar ne charge pas (par exemple, si le cache est obsolète)
    $avatarImg.on("error", function() {

        //Affichage d'un avatar d'erreur
        $avatarImg.attr("src", GM_getResourceURL("error"));

        $avatar.attr("data-error", "1");

        $avatar.append($avatarImg);

        $avatarImg.fadeIn(function() {
            message.$msg.addClass("not-loading");
        });

        //Suppression du cache local
        SK.Util.deleteValue("authors." + message.author.pseudo);

        //Rechargement du cache distant
        SK.Util.api("pseudos", [ message.author.pseudo ], false, true, false);

    });

    //On met seulement src pour que l'event onload soit en place avant
    $avatarImg.attr("src", message.author.avatar); 

    //Permet de régler les problèmes de cache sur certains navigateurs
    if(this.complete) {
        $(this).trigger("load");  
    }
};

/** Calcule et redimensionne (en CSS) l'avatar passé en parametre */
SK.moduleConstructors.InfosPseudo.prototype.resizeAndCenterAvatar = function($avatarImg) {

    var imageDimensions = {
        w: $avatarImg.width(),
        h: $avatarImg.height()
    };

    if(imageDimensions.h > imageDimensions.w) {
        $avatarImg.css({
            width: this.avatarSize + "px",
        });
    }
    else {
        $avatarImg.css({
            height: this.avatarSize + "px",
        });

        //On execute l'opération en deux fois, car les dimensions changent dynamiquement
        $avatarImg.css({
            left: (this.avatarSize - $avatarImg.width()) / 2
        });
    }
};

/**
 * Change la couleur du pseudo posts de l'utilisateur courant.
 */
SK.moduleConstructors.InfosPseudo.prototype.highlightCurrentUser = function() {
    //Cherche le pseudonyme de l'utilisateur
    var currentUserPseudo = $("#compte strong").first().text().trim();

    //On teste dans chaque message
    $(".msg .pseudo").each(function() {

        var $postPseudo = $(this).find("strong").first();
        var postTextPseudo = $postPseudo.text().trim();
        // Si l'auteur du message correspond à ce pseudonyme
        if (postTextPseudo === currentUserPseudo) {
            //Met en valeur le message
            $postPseudo.addClass("current-user");
        }
    }); 
};

/** Parcours la liste des messages et souligne le pseudo qui correspond à celui de l'auteur **/
SK.moduleConstructors.InfosPseudo.prototype.underlineAuthorTopic = function(authorTopic) {

	//On teste dans chaque message
    $(".msg .pseudo").each(function() {
		
        var $postPseudo = $(this).find("strong").first();
        var postTextPseudo = $postPseudo.text().trim().toLowerCase();
        // Si l'auteur du message correspond à ce pseudonyme
        if (postTextPseudo == authorTopic) {
            //Met en valeur le message
            $postPseudo.addClass("current-authorTopic");
        }
    }); 
}

/**
 * Récupère l'auteur du topic courant puis appelle la fonction pour souligner son pseudo.
 */
SK.moduleConstructors.InfosPseudo.prototype.highlightCurrentAuthor = function() {
    //Création de la clé
	var currentURLSplit = document.URL.split("-")
	var currentForum = currentURLSplit[1];
	var currentTopic = currentURLSplit[2];
	var key = currentForum + "." + currentTopic;
	
	var authorTopic = SK.Util.getValue(key, true)
	
	//Si la clé n'est pas présente dans le sessionStorage
    if (authorTopic == null) {
	
		//Si on est sur le formulaire de réponse
		if (SK.Util.currentPageIn(["topic-response"])) {
		
			var nbResponses = $(".msg").length;
			
			//S'il y a moins de 10 réponses, on peut déterminer l'auteur
			if (nbResponses < 10) {
				authorTopic = $(".msg:eq(0) .pseudo > strong").text().trim().toLowerCase();
				SK.Util.setValue(key, authorTopic, true);
				this.underlineAuthorTopic(authorTopic);
			} 
			
			//Sinon, requête HTTP vers la première page
			else {
				var requestURL = "forums/1-" + currentForum + "-" + currentTopic + "-1-0-1-0-0.xml";
	
				SK.Util.jvc(requestURL, function(firstPage) {
					var contenu = $(firstPage.find("contenu").text());
					var authorTopic = contenu.find(".pseudo").text().split(" ")[0].trim().toLowerCase();
					SK.Util.setValue(key, authorTopic, true);
					SK.moduleConstructors.InfosPseudo.prototype.underlineAuthorTopic(authorTopic);
				});
			}
		}
		else {
			var currentPage = currentURLSplit[3]
			
			//Si on est sur la première page du topic, on récupère directement l'auteur
			if (currentPage == "1") {
				authorTopic = $(".msg:eq(0) > .pseudo > strong").text().trim().toLowerCase();
				SK.Util.setValue(key, authorTopic, true);
				this.underlineAuthorTopic(authorTopic);
			} 
			
			//Sinon, on fait une requête HTTP vers la première page du topic
			else {
				var requestURL = "forums/1-" + currentForum + "-" + currentTopic + "-1-0-1-0-0.xml";
	
				SK.Util.jvc(requestURL, function(firstPage) {
					var contenu = $(firstPage.find("contenu").text());
					authorTopic = contenu.find(".pseudo").text().split(" ")[0].trim().toLowerCase();
					SK.Util.setValue(key, authorTopic, true);
					SK.moduleConstructors.InfosPseudo.prototype.underlineAuthorTopic(authorTopic);
				});
			}
		}
	}
	else {
		this.underlineAuthorTopic(authorTopic);
	}
};


SK.moduleConstructors.InfosPseudo.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn([ "topic-read", "topic-response", "post-preview", "topic-list" ]);
};

SK.moduleConstructors.InfosPseudo.prototype.settings = {
    enableAvatar: {
        title: "Affichage des avatars",
        description: "Affiche les avatars à gauche des posts à la lecture d'un topic.",
        type: "boolean",
        default: true,
    },
    avatarSize: {
        title: "Taille des avatars",
        description: "Choix de la taille des avatars",
        type: "select",
        options: { "40": "Petit", "60": "Moyen", "80": "Grand" },
        default: "60",
    },
    enableRank: {
        title: "Affichage des rangs",
        description: "Affiche le rang de l'auteur sur les posts à la lecture d'un topic.",
        type: "boolean",
        default: true,
    },
    rankLocation: {
        title: "Emplacement du rang",
        description: "Permet de choisir où le rang doit apparaître sur le post",
        type: "select",
        options: { avatar: "Sur l'avatar", topBar: "À gauche du bouton CDV" },
        default: "avatar",
    },
    enableMP: {
        title: "Bouton de MP",
        description: "Permet d'envoyer un MP à un utilisateur directement depuis un post.",
        type: "boolean",
        default: true,
    },
    enableSex: {
        title: "Affichage du sexe de l'auteur",
        description: "Affiche une photo de la... Hmm...Pardon. Change le style du bouton de CDV d'un auteur en fonction de son sexe.",
        type: "boolean",
        default: true,
    },
    enablePermalink: {
        title: "Bouton Permalien",
        description: "Ajoute un bouton permettant de copier directement le permalien d'un post.",
        type: "boolean",
        default: true,
    },
    enableAlert: {
        title: "Bouton d'avertissement",
        description: "Ajoute un bouton permettant d'avertir un administrateur.",
        type: "boolean",
        default: true,
    },
    enablePermalinkAnchor: {
        title: "Bouton ancre Permalien",
        description: "Ajoute un bouton ancre du permalien d'un post.",
        type: "boolean",
        default: false,
    },
    enableSearchTopics: {
        title: "Bouton de recherche des topics d'un auteur",
        description: "Ajoute un bouton permettant de rechercher les topics créés par l'utilisateur dans le forum courant.",
        type: "boolean",
        default: false,
    },
    modalProfile: {
        title: "Charger la CDV dans une modale",
        description: "Affiche le profil de l'auteur dans une fenêtre modale au clic.",
        type: "boolean",
        default: true,
    },
    enableUserHighlight: {
        title: "Mise en valeur de vos messages",
        description: "Affiche votre pseudonyme en bleu pour les messages que vous avez postés.",
        type: "boolean",
        default: false,
    },
	enableAuthorHighlight: {
        title: "Mise en valeur des messages de l'auteur du topic",
        description: "Affiche le pseudonyme en souligné pour les messages que l'auteur du topic a postés.",
        type: "boolean",
        default: false,
    }
};

SK.moduleConstructors.InfosPseudo.prototype.getCss = function() {

    var css = "";
    
    //Si on met en valeur les posts de l'utilisateur
    if(this.getSetting("enableUserHighlight")) {
        css += "\
            .current-user {\
                color: " + SK.modules.StartSpawnKill.darkColor + ";\
            }\
        ";
    }
	
	//Si on met en valeur les posts de l'auteur
    if(this.getSetting("enableAuthorHighlight")) {
        css += "\
            .current-authorTopic {\
                text-decoration: underline;\
            }\
        ";
    }

    //Seulement si les avatars sont affichés
    if(this.getSetting("enableAvatar")) {

        var littleAvatar = this.avatarSize === 40;
        var banTempoLabel = littleAvatar ? "tempo" : "ban tempo";
        var banDefLabel = littleAvatar ? "def" : "ban def";

        css += "\
            .msg ul {\
                margin-left: " + (this.avatarSize + 18) + "px;\
            }\
            .msg ul li.suite_sujet {\
                margin-left: -" + (this.avatarSize + 18) + "px;\
            }\
            .msg {\
                min-height: " + (this.avatarSize + 18) + "px;\
            }\
            .msg .avatar-wrapper {\
                display: block;\
                position: absolute;\
                    left: 9px;\
                    top: 9px;\
                width: " + (this.avatarSize) + "px;\
                height: " + (this.avatarSize) + "px;\
            }\
            .msg .avatar {\
                position: relative;\
                display: block;\
                width: 100%;\
                height: 100%;\
                overflow: hidden;\
                box-shadow: 0px 2px 3px -2px rgba(0, 0, 0, 0.8);\
                cursor: pointer;\
                z-index: 100;\
            }\
            .msg:not(.not-loading)::after {\
                content: \"\";\
                display: block;\
                width: " + (this.avatarSize) + "px;\
                height: " + (this.avatarSize) + "px;\
                position: absolute;\
                    top: 9px;\
                    left: 9px;\
                background-color: #FFF;\
                box-shadow: 0px 2px 3px -2px rgba(0, 0, 0, 0.8);\
                background-image: url('" + GM_getResourceURL("loader") + "');\
                background-repeat: no-repeat;\
                background-position: " + (this.avatarSize / 2 - 8) + "px;\
                z-index: 10;\
            }\
            .msg .avatar img {\
                position: relative;\
            }\
            .avatar.ban img {\
                background-color: #FFF;\
                width: 100%;\
            }\
            .avatar.ban::after {\
                content: \"banni\";\
                position: absolute;\
                bottom: 0px;\
                left: 0px;\
                width: 100%;\
                text-align: center;\
                padding: 1px 0px;\
                background-color: #000;\
                color: #FFF;\
            }\
            .avatar.ban.def::after {\
                content: \"" + banDefLabel + "\";\
            }\
            .avatar.ban.tempo::after {\
                content: \"" + banTempoLabel + "\";\
            }\
            .rank {\
                position: absolute;\
                    bottom: 0px;\
                    right: 0px;\
                display: block;\
                width: 16px;\
                height: 16px;\
                background-repeat: no-repeat;\
                z-index: 200;\
            }\
            .rank.argent {\
                background-image: url('" + GM_getResourceURL("argent") + "');\
                background-color: #A7A9AC;\
            }\
            .rank.carton {\
                background-image: url('" + GM_getResourceURL("carton") + "');\
                background-color: #C49A6C;\
            }\
            .rank.bronze {\
                background-image: url('" + GM_getResourceURL("bronze") + "');\
                background-color: #C57E16;\
            }\
            .rank.diamant {\
                background-image: url('" + GM_getResourceURL("diamant") + "');\
                background-color: #27AAE1;\
            }\
            .rank.emeraude {\
                background-image: url('" + GM_getResourceURL("emeraude") + "');\
                background-color: #39B54A;\
            }\
            .rank.or {\
                background-image: url('" + GM_getResourceURL("or") + "');\
                background-color: #DBB71D;\
            }\
            .rank.rubis {\
                background-image: url('" + GM_getResourceURL("rubis") + "');\
                background-color: #BE1E2D;\
            }\
            .rank.saphir {\
                background-image: url('" + GM_getResourceURL("saphir") + "');\
                background-color: #4D57BC;\
            }\
        ";
    }

    css += "\
        .msg [src='http://image.jeuxvideo.com/pics/forums/bt_forum_profil.gif'],\
        .msg [alt='Avertir un administrateur'],\
        .ancre > a:first-child {\
          display: none !important;\
        }\
        .msg li.ancre {\
            min-height: 15px;\
        }\
        .sk-button-content.mp {\
            background-image: url('" + GM_getResourceURL("mp") + "');\
            background-color: #FCCB0C;\
            border-bottom-color: #C6860F;\
        }\
        .sk-button-content.searchTopics {\
            background-image: url('" + GM_getResourceURL("search-topics") + "');\
            background-color: #FFA500;\
            border-bottom-color: #8d5b00;\
        }\
        .sk-button-content.minus {\
            background-image: url('" + GM_getResourceURL("minus") + "');\
        }\
        .sk-button-content.plus {\
            background-image: url('" + GM_getResourceURL("plus") + "');\
        }\
        .sk-button-content.link {\
            background-image: url('" + GM_getResourceURL("link") + "');\
            background-color: #A3A3A3;\
            border-bottom-color: #525252;\
        }\
        .sk-button-content.anchor {\
            background-image: url('" + GM_getResourceURL("anchor") + "');\
            background-color: #777;\
            border-bottom-color: #000;\
        }\
        .sk-button-content.male {\
            background-image: url('" + GM_getResourceURL("male") + "');\
            background-color: #348DCC;\
            border-bottom-color: #1C4F72;\
        }\
        .sk-button-content.female {\
            background-image: url('" + GM_getResourceURL("female") + "');\
            background-position: -1px -1px;\
            background-color: #D674AE;\
            border-bottom-color: #A44C80;\
        }\
        .sk-button-content.unknown {\
            background-image: url('" + GM_getResourceURL("unknown") + "');\
            background-position: 0px -1px;\
            background-color: #6EBD1A;\
            border-bottom-color: #4D8412;\
        }\
        .sk-button-content.alert {\
            background-image: url('" + GM_getResourceURL("alert") + "');\
            background-color: #FE2711;\
            border-bottom-color: #A0170B;\
        }\
        .sk-button-content.rank {\
            position: static;\
            border: none !important;\
            height: 15px !important;\
            cursor: default;\
        }\
        .sk-button-content.rank:active {\
            margin-top: 0px !important;\
            border-bottom: none !important;\
        }\
        .sk-button-content.rank.argent {\
            background-image: url('" + GM_getResourceURL("argent") + "');\
            background-color: #A7A9AC;\
        }\
        .sk-button-content.rank.carton {\
            background-image: url('" + GM_getResourceURL("carton") + "');\
            background-color: #C49A6C;\
        }\
        .sk-button-content.rank.bronze {\
            background-image: url('" + GM_getResourceURL("bronze") + "');\
            background-color: #C57E16;\
        }\
        .sk-button-content.rank.diamant {\
            background-image: url('" + GM_getResourceURL("diamant") + "');\
            background-color: #27AAE1;\
        }\
        .sk-button-content.rank.emeraude {\
            background-image: url('" + GM_getResourceURL("emeraude") + "');\
            background-color: #39B54A;\
        }\
        .sk-button-content.rank.or {\
            background-image: url('" + GM_getResourceURL("or") + "');\
            background-color: #DBB71D;\
        }\
        .sk-button-content.rank.rubis {\
            background-image: url('" + GM_getResourceURL("rubis") + "');\
            background-color: #BE1E2D;\
        }\
        .sk-button-content.rank.saphir {\
            background-image: url('" + GM_getResourceURL("saphir") + "');\
            background-color: #4D57BC;\
        }\
    ";

    return css;

};