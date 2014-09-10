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
	* Fonction de passage à la page précedente
	*/
	function previousPage() {
		var path = window.location.href;
		var splitLoca = path.split("-");

		if(splitLoca[3] > 1) {

			splitLoca[3] = parseInt(splitLoca[3]) - 1;
			splitLoca[3] = splitLoca[3].toString();
			var nbSegment = splitLoca.length;
			var urlFinale = "";

			for(var i = 0; i < nbSegment; i++) {
				if(i != nbSegment - 1) {
					urlFinale += splitLoca[i] + "-";
				}
				else {
					urlFinale += splitLoca[i];
				}
			}
			window.location.href = urlFinale;
		}
	}

	/**
	*Fonction de passage à la page suivante
	*/
	function nextPage() {
		var path = window.location.href;
		var splitLoca = path.split("-");
		var nbPageMax = "";
		var $paginationLinks = $(".pagination").eq(0).find("a");

		//Permet de récupérer le nombre de page sur les gros topics
		if($paginationLinks.last().html() === "»") {
			nbPageMax = parseInt($paginationLinks.eq($paginationLinks.length - 2).html());
		}
		else {
			nbPageMax = parseInt($paginationLinks.last().html());
		}

		if(splitLoca[3] < nbPageMax) {

			splitLoca[3] = parseInt(splitLoca[3]) + 1;
			splitLoca[3] = splitLoca[3].toString();
			var nbSegment = splitLoca.length;
			var urlFinale = "";
			for(var i = 0; i < nbSegment; i++) {
				if(i != nbSegment - 1) {
					urlFinale += splitLoca[i] + "-";
				}
				else {
					urlFinale += splitLoca[i];
				}
			}
			window.location.href = urlFinale;
		}
	}



    /**
     * Analyse des touches utilisées par l'utilisateur et appel de la fonction suivant le raccourci utilisé
     */
		$(window).keydown(function(event) {

			var LEFT_ARROW_KEY = 37,
				UP_ARROW_KEY = 38,
				RIGHT_ARROW_KEY = 39,
				DOWN_ARROW_KEY = 40,
				ENTER_KEY = 13,
				SPACE_KEY = 32,
				ESCAPE_KEY = 27;

			// Si l'on se trouve dans un champ de texte, on désactive les raccourcis
			var target = event.target || event.srcElement;
			if (target.tagName === "TEXTAREA" || (target.tagName === "INPUT" && target.type === "text")) {
				return;
			}

			//Page lecture d'un topic
			if (SK.Util.currentPageIn(SK.common.Pages.TOPIC_READ)) {

				//Ctrl + fleche gauche -> page précedente
				if (event.ctrlKey && event.keyCode === LEFT_ARROW_KEY) {
					event.preventDefault();
					previousPage();
				}

				//Ctrl + fleche doite -> page suivante
				if (event.ctrlKey && event.keyCode === RIGHT_ARROW_KEY) {
					event.preventDefault();
					nextPage();
				}
			}

			//Sur toutes les pages

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