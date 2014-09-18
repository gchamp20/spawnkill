"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Objet parent de tous les modules de SpawnKill
 *
 */
SK.Module = function() {
    /** File de fonctions à exécuter */
    this.internal_queue = [];
};

//MÉTHODES ET ATTRIBUTS POUVANT ÊTRE REDÉFINIS DANS LES MODULES ENFANTS

/**
 * true si le module ne peut pas être désactivé.
 */
SK.Module.prototype.required = false;

/**
 * true si le module n'est pas visible dans le panneau de configuration.
 */
SK.Module.prototype.hidden = false;

/**
 * Id du module
 */
SK.Module.prototype.id = "";

/**
 * Titre du module
 */
SK.Module.prototype.title = "";

/**
 * Description du module
 */
SK.Module.prototype.description = "";

/**
 * Initialise le module, à redéfinir dans le Module fils
 */
SK.Module.prototype.init = function() {};

/**
 * Méthode testant si un Module doit être activé.
 * peut-être redéfinie dans le fils.
 * Par défaut le module est toujours activé
 */
SK.Module.prototype.shouldBeActivated = function() {
    return true;
};

/**
 * Options configurables du plugin.
 * Ces options apparaitront dans le panneau de configuration de SpawnKill
 */
SK.Module.prototype.settings = {};

/**
 * Retourne le CSS à injecter si le plugin est activé.
 * Par défaut, aucun CSS n'est injecté.
 */
SK.Module.prototype.getCss = function() {
    return "";
};

/**
 * Fonction exécutée avant le chargement du CSS mais après le chargement des options du module.
 * Permet de calculer des éléments nécessaires au CSS.
 */
SK.Module.prototype.beforeInit = function() {};

//METHODE UTILS A NE PAS REDEFINIR

/**
 * Retourne la valeur d'un paramètre
 */
SK.Module.prototype.getSetting = function(settingKey) {
    return this.settings[settingKey].value;
};

/**
 * Permet de créer un nouveau module. Il est possible de passer une fonction à exécuter dans le constructeur
 */
SK.Module.new = function(constructor) {
    constructor = constructor || function() {};
    var module = function() {
        SK.Module.apply(this);
        constructor(this);
    };
    module.prototype = Object.create(SK.Module.prototype);
    return module;
};


//MÉTHODES INTERNES À NE SURTOUT PAS REDÉFINIR

/**
 * Méthode interne permettant d'initialiser le module si besoin,
 * à ne pas redéfinir, la méthode d'init réelle est init()
 */
SK.Module.prototype.internal_init = function() {
    if(this.shouldBeActivated()) {
        this.init();
    }
};

/**
 * À ne pas redéfinir, charge le CSS du Module.
 * La méthode à redéfinir est getCss().
 */
SK.Module.prototype.internal_getCss = function() {

    if(this.shouldBeActivated()) {
        return this.getCss();
    }
    else {
        return "";
    }
};

/** Timer de la file de fonctions */
SK.Module.prototype.internal_timer = null;


SK.Module.prototype.internal_clearFunction = function() {
    clearTimeout(this.internal_timer);
    this.internal_queue = [];
};

/**
 * Méthode à utiliser pour mettre du code en file d'attente
 * afin d'éviter de bloquer le navigateur avec des opérations
 * lourdes.
 * Le code est exécuté dans l'ordre de la file avec un petit
 * délai entre chaque.
 */
SK.Module.prototype.queueFunction = function(fn, context, time) {
    var self = this;

    var setTimer = function(time) {
        self.internal_timer = setTimeout(function() {
            time = self.queueFunction();
            if(self.internal_queue.length) {
                setTimer(time);
            }
        }, time || 0);
    };

    if(fn) {
        self.internal_queue.push([fn, context, time]);
        if(self.internal_queue.length == 1) {
            setTimer(time);
        }
        return;
    }

    var next = self.internal_queue.shift();
    if(!next) {
        return 0;
    }
    next[0].call(next[1] || window);

    return next[2];
};