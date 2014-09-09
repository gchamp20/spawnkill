"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Objet principal de SpawnKill.
 */
window.SK = {

	/**
	 * Réuni les variables communes à tous les modules.
	 */
	common: {

		/**
		 * Types de pages de JVC
		 */
		Pages: Object.freeze({

			TOPIC_LIST: 	"topic-list",
			TOPIC_READ: 	"topic-read",
			TOPIC_FORM: 	"topic-form",
			TOPIC_RESPONSE: "topic-response",
			POST_PREVIEW: 	"post-preview",
			OTHER: 			"other"
			
		})
	},

	/*
	 * Contient tous les constructeurs de modules de SpawnKill
	 */
	moduleConstructors: {},

	/**
	 * Instances des modules activés
	 */
	modules: []
};