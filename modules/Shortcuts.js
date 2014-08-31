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
		var target = event.target || event.srcElement;
		// Partout
		// ...

		// Sur la liste des topics
		if (SK.Util.currentPageIn([ "topic-list" ])) {

		}

		// Sur la liste des posts
		else if (SK.Util.currentPageIn([ "topic-read" ])) {
			// Si l'on se trouve dans un champ de texte, on désactive les raccourcis (voir https://github.com/dorian-marchal/spawnkill/issues/30)
			if (target.tagName === "TEXTAREA" || (target.tagName === "INPUT" && target.type === "text")) {
				return;
			}

			//Ctrl + fleche gauche -> page précedente
			if (event.ctrlKey && event.keyCode === 37) {
				previousPage();
				event.preventDefault();
			}
			//Ctrl + fleche doite -> page suivante
			if (event.ctrlKey && event.keyCode === 39) {
				nextPage();
				event.preventDefault();
			}
		}

		// Sur le formulaire de réponse
		else if (SK.Util.currentPageIn([ "topic-form" ])) {

		}

		// Après une tentative de réponse ratée
		else if (SK.Util.currentPageIn([ "topic-response" ])) {

		}

		// Lors de la prévisualisation d'un post
		else if (SK.Util.currentPageIn([ "post-preview" ])) {

		}
	});
};