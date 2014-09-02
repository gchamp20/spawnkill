"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * ServerAlert : Module temporaire permettant d'avertir les utilisateurs des problèmes rencontrés avec le serveur
 */
SK.moduleConstructors.ServerAlert = SK.Module.new();

SK.moduleConstructors.ServerAlert.prototype.id = "ServerAlert";
SK.moduleConstructors.ServerAlert.prototype.title = "Module temporaire";
SK.moduleConstructors.ServerAlert.prototype.description = "Permet d'avertir les utilisateurs des problèmes rencontrés avec le serveur";
SK.moduleConstructors.ServerAlert.prototype.required = true;

SK.moduleConstructors.ServerAlert.prototype.init = function() {

	var alertSeen = SK.Util.getValue("alert.seen");

	var $downloadButton = new SK.Button({
	    class: "large",
	    text: "En savoir plus",
	    href: "http://www.jeuxvideo.com/forums/1-1000021-2267708-38-0-1-0-script-jvc-spawnkill-avant-respawn.htm#message_2297960",
	    target: "_blank",
	    tooltip: {
	        class: "large bottom-right",
	        text: "En savoir plus",
	        position: "bottom"
	    }
	});

	var $modal = new SK.Modal({
		class: "alert",
	    location: "notification",
	    title: "Problèmes avec le serveur de SpawnKill",
	    content: "<p>Merci de cliquer sur le bouton ci-dessous pour en apprendre d'avantage</p><img src=\"http://image.jeuxvideo.com/smileys_img/58.gif\" alt=\"\" height=\"40\" width=\"44\">",
	    buttons: [ $downloadButton ],
	    closeButtonAction: function() {
	    	SK.Util.hideModal();
	    	SK.Util.setValue("alert.seen", true);
	    }
	});

	if(alertSeen !== true) {
		SK.Util.showModal($modal);
	}
};

SK.moduleConstructors.ServerAlert.prototype.getCss = function() {

	var css = "\
		.modal-box.alert p {\
			margin-bottom: 10px !important;\
			line-height: 1.3 !important;\
			margin-top: 8px !important;\
			font-size: 1.2em !important;\
		}\
	";
    return css;
};
