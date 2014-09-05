"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * WarnOnNewPost : Permet de savoir quand un nouveau message a été posté dans un topic sans recharger la page
 */
SK.moduleConstructors.WarnOnNewPost = SK.Module.new();

SK.moduleConstructors.WarnOnNewPost.prototype.id = "WarnOnNewPost";
SK.moduleConstructors.WarnOnNewPost.prototype.title = "Indiquer les nouveaux posts";
SK.moduleConstructors.WarnOnNewPost.prototype.description = "Indique le nombre de nouveaux messages postés depuis que la page a chargé dans le titre de l'onglet";

SK.moduleConstructors.WarnOnNewPost.prototype.init = function() {

	var self = this;
	var startTimeout = 3000;
	var checkInterval = 5000;

	//Element lié au canvas
	var img = new Image();
	var ctx = null;
	var canvas = null;
	var $faviconLink = null;

	//Récupération de l'id du topic
	var match = window.location.href.match(/http:\/\/www\.jeuxvideo\.com\/forums\/1-(\d*-\d*).*/);
	var topicId = match[1];

	//Change le favicon en icone de notifiction
	var updateFavicon = function(postDifference) {


		$(img).on("load", function() {

			//Font
			ctx.font = "10px Verdana";
			ctx.textBaseline = "bottom";

			//On limite l'icon à 99
			var iconText = Math.min(99, postDifference);

			//Affichage d'un croix à la réception de données erronées (ou problème de connexion)
			if(isNaN(iconText)) {
				iconText = "X";
			}

			//Dessin de l'icone
			var textWidth = ctx.measureText(iconText).width;
			ctx.drawImage(img, 0, 0);
			ctx.fillStyle = "#D62222";
			ctx.fillRect(0, 0, textWidth + 3, 11);
			ctx.fillStyle = "#FFF";
			ctx.fillText(iconText, 1, 11);

			var faviconUrl = canvas.toDataURL("image/png");

			$faviconLink.remove();
			$faviconLink = $("<link>", {
				href: faviconUrl,
				rel: "shorcut icon",
				type: "image/png"
			});
			$("head").append($faviconLink);
		});

		//Récupération du favicon
		img.src = "http://www.jeuxvideo.com/favicon.ico";
	};

    //Timeout de 3 secondes pour éviter que le script ne retarde le chargement de la page
    setTimeout(function() {

    	//Si les notifications sonores sont activées, on charge le son
    	var playSound = self.getSetting("playSoundOnNewPost");

    	if(playSound) {

    		var notificationSound = $("<audio>", {
    			html: "<source src='" + GM_getResourceURL("notification") + "' type='audio/ogg'>"
    		}).get(0);
    	}


    	//Nombre de posts au chargement
    	var initialPostCount = 0;

    	//Nombre de posts au dernier chargement
    	var lastPostCount = 0;

    	//On crée l'élément link du favicon (JVC n'en a pas de base)
    	$faviconLink = $("<link>", {
    		rel: "shortcut icon",
    		type: "image/png",
    		href: "http://www.jeuxvideo.com/favicon.ico"
    	});

    	$("head").append($faviconLink);

    	//Création du canvas
    	canvas = $("<canvas>").get(0);
    	canvas.width = 16;
    	canvas.height = 16;
    	ctx = canvas.getContext("2d");

    	//On récupère les infos initiales du topic
    	self.getPostCount(topicId, function(postCount) {

    		initialPostCount = postCount;

    		//On récupère de nouveau les infos du topic à intervale régulier
    		setInterval(function() {

    			self.getPostCount(topicId, function(newPostCount) {
    				//Si le nombre de posts est différent, on met à jour le titre de la page

    				//Si newPostCount === -1, il y a eu une erreur
    				if(newPostCount !== -1) {
	    				if(lastPostCount !== newPostCount && initialPostCount !== newPostCount) {
	    					updateFavicon(newPostCount - initialPostCount);
	    					lastPostCount = newPostCount;
	    					if(playSound) {
	    						notificationSound.play();
	    					}
	    				}
	    			}

    			});

    		}, checkInterval);
    	});
    }, startTimeout);
};

/**
 * Récupère le nombre de posts du topic via l'API JVC.
 * Appelle la fonction de callback avec le nombre de posts en arguments.
 */
SK.moduleConstructors.WarnOnNewPost.prototype.getPostCount = function(topicId, callback) {

	SK.Util.apiHelper.topicInfos(topicId, function(topicInfos) {

		//En cas d'erreur, on n'appelle pas le callback
		if (typeof topicInfos === "undefined") {
			return;
		}
		callback(topicInfos.postCount);

	}, false);
    
};

SK.moduleConstructors.WarnOnNewPost.prototype.settings = {
    playSoundOnNewPost: {
        title: "Jouer un son quand un nouveau post est ajouté",
        description: "Joue un son de notification quand un post est ajouté au topic après le chargement de la page.",
        type: "boolean",
        default: true,
    }
};

SK.moduleConstructors.WarnOnNewPost.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn([ "topic-read" ]);
};