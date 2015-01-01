"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * Settings: permet de choisir et configurer les modules à activer de SpawnKill
 */
SK.moduleConstructors.Settings = SK.Module.new();

SK.moduleConstructors.Settings.prototype.id = "Settings";
SK.moduleConstructors.Settings.prototype.title = "Configuration";
SK.moduleConstructors.Settings.prototype.description = "Ajoute une fenêtre de configuration pour SpawnKill.";
SK.moduleConstructors.Settings.prototype.required = true;
SK.moduleConstructors.Settings.prototype.hidden = true;

SK.moduleConstructors.Settings.prototype.init = function() {

    //On n'ajoute le bouton de paramètres que sur les pages du forum
    if (SK.Util.currentPageIn(SK.common.Pages.TOPIC_LIST, SK.common.Pages.TOPIC_READ)) {
        this.addSettingsButton();
    }

    this.showSettingsIfNeeded();
};

/* Affiche le panneau de configuration */
SK.moduleConstructors.Settings.prototype.showSettings = function() {
    SK.Util.showModal(this.getModal());
};

/* Affiche le panneau de configuration au premier lancement du script */
SK.moduleConstructors.Settings.prototype.showSettingsIfNeeded = function() {
    if(!SK.Util.getValue("seenSettings")) {
        window.setTimeout(function() {
            this.showSettings();
            //Le panneau ne doit s'afficher qu'une fois
            SK.Util.setValue("seenSettings", true);
        }.bind(this), 200);
    }
};

/* Ajoute le bouton de configuration */
SK.moduleConstructors.Settings.prototype.addSettingsButton = function() {

    var $settingsButton = new SK.Button({
        class: "minor settings",
        tooltip: {
            text: "Configuration de SpawnKill",
            position: "right"
        },
        wrapper: {
            id: "settings-button"
        },
        click: function(event) {
            event.preventDefault();
            this.showSettings();
        }.bind(this)
    });

    //#select_taille pour les forumsjv
    $(".options-crumb").append($settingsButton);
};

/* Retourne la fenêtre modale de configuration */
SK.moduleConstructors.Settings.prototype.getModal = function() {

    var self = this;

    var $okButton = new SK.Button({
        class: "large",
        text: "Valider",
        tooltip: {
            class: "large",
            text: "Confirmer le paramètrage",
            position: "bottom"
        },
        click: function(event) {
            event.preventDefault();
            self.saveSettings();
            window.location.reload();
        }
    });

    var $cancelButton = new SK.Button({
        class: "large minor",
        text: "Annuler",
        tooltip: {
            class: "large",
            text: "Annuler les modifications",
            position: "bottom"
        },
        click: function(event) {
            event.preventDefault();
            SK.Util.hideModal();
        }.bind(this)
    });

    var $modal = new SK.Modal({
        id: "setting-modal",
        location: "top",
        title: "Configuration de SpawnKill",
        hasCloseButton: false,
        content: this.getSettingsUI(),
        buttons: [ $cancelButton, $okButton ],
        onModalShow: function() {

            //Si la modale est plus haute que l'écran, on la fait scroller
            self.shrinkSettingsModal();
        }
    });


    return $modal;
};


/**
 * Retourne un objet jQuery représentant le contenu de la modale de paramètrage
 */
SK.moduleConstructors.Settings.prototype.getSettingsUI = function() {

    var self = this;
    var ui = "";

    ui += "<span class='settings-spawnkill-version' >" + SK.VERSION + "</span>";
    ui += "<ul id='settings-form' >";
        for(var moduleKey in SK.modules) {

            var module = SK.modules[moduleKey];

            if(!module.hidden) {
                ui += "<li title='" + SK.Util.htmlEncode(module.description) + "' class='setting" +
                  (module.required ? " required" : "") + "' data-activated='" + (module.activated ? "1" : "0") +
                  "' data-id='" + moduleKey + "' >";

                    ui += "<div class='main-setting' >" + SK.Util.htmlEncode(module.title) + "</div>";
                    ui += "<hr>";
                    ui += "<ul class='options fold' >";
                        for(var settingKey in module.settings) {
                            var setting = module.settings[settingKey];
                            ui += "<li class='option' title='" + SK.Util.htmlEncode(setting.description) +
                              "' data-id='" + settingKey + "' >";
                                ui += SK.Util.htmlEncode(module.settings[settingKey].title);
                            ui += "</li>";
                        }
                    ui += "</ul>";
                ui += "</li>";
            }
        }
    ui += "</ul>";

    var $ui = $(ui);

    //On ajoute l'intéractivité (toggle, boutons de sous-options, ...)
    $ui.find(".setting").each(function() {

        var $setting = $(this);
        var $mainSetting = $setting.find(".main-setting");
        var disabled = $mainSetting.parent().hasClass("required");
        var subOptions = $mainSetting.siblings(".options").find(".option");
        var module = SK.modules[$(this).attr("data-id")];

        //Slide-toggles Settings
        $mainSetting.append(new SK.SlideToggle({
            value: $setting.attr("data-activated") === "1",
            checkbox: {
                disabled: disabled
            }
        }));

        //Boutons sous-options
        var $settingButton = new SK.Button({
            class: "settings",
            tooltip: {
                text: "Afficher/Masquer les options du module",
                position: "right"
            },
            wrapper: {
                class: "subsettings-button"
            },
            //Ouverture/fermeture du panneau d'options
            click: function() {
                var $options = $setting.find(".options");

                $options.on("transitionend webkitTransitionEnd", function() {
                    self.shrinkSettingsModal();
                });
                $options.toggleClass("fold");
            }
        });

        if (subOptions.length > 0) {
            $mainSetting.append($settingButton);
        }

        //Slide-toggles Options
        $setting.find(".option").each(function() {

            var $option = $(this);
            var option = module.settings[$option.attr("data-id")];

            if (option.type === "boolean") {

                var toggleOptions = {
                    value: option.value,
                };

                if (option.disabled === true) {
                    toggleOptions.checkbox = {
                        disabled: "disabled"
                    };
                }

                $option.append(new SK.SlideToggle(toggleOptions));
            }
            else if (option.type === "select") {
                $option.append(new SK.DropdownList({
                    values: option.options,
                    value: option.value
                }));
            }
            else if (option.type === "button") {
                $option.append(new SK.Button({
                    text: option.buttonLabel,
                    class: "large",
                    tooltip : {
                        text: option.title,
                        position: "bottom"
                    },
                    click: option.value
                }));
            }
        });
    });

    return $ui;
};

/**
 * Si la hauteur de la modale est plus importante que celle de l'écran,
 * On force une barre de scroll.
 */
SK.moduleConstructors.Settings.prototype.shrinkSettingsModal = function() {

    var $settingsModal = $("#setting-modal").first();
    var contentsHeight = $settingsModal.find(".content").prop("scrollHeight");
    var screenHeight = $(window).height();

    //Hauteur maximale du contenu de la popup
    var maxContentHeight = screenHeight - 100;


    if(contentsHeight > maxContentHeight) {

        $settingsModal.find(".content").css("height", maxContentHeight + "px");

        $settingsModal.addClass("scroll");
    }
    else {
        $settingsModal.find(".content").css("height", "auto");
        $settingsModal.removeClass("scroll");
    }
};


/** Parcourt l'interface de paramètrage et enregistre les préférences */
SK.moduleConstructors.Settings.prototype.saveSettings = function() {

    //On parcourt l'interface et on enregistre les préférences
    $("#settings-form .setting").each(function() {
        var $setting = $(this);
        var settingId = $setting.attr("data-id");
        var setting = SK.modules[settingId];
        var settingIsActivated = $setting.find(".main-setting .slide-toggle input").prop("checked");
        SK.Util.setValue(settingId, settingIsActivated);

        //Enregistrement des options des modules
        $setting.find(".option").each(function() {

            var $option = $(this);
            var optionId = $option.attr("data-id");
            var option = setting.settings[optionId];
            var optionLocalstorageId = settingId + "." + $option.attr("data-id");
            var optionValue = null;

            //Si l'"option" est un bouton, on n'enregistre pas de valeur
            if(option.type === "button") {
                return;
            }

            if(option.type === "boolean") {
                optionValue = $option.find("input").prop("checked");
            }
            else if(option.type === "select") {
                optionValue = $option.find("select").val();
            }
            SK.Util.setValue(optionLocalstorageId, optionValue);

        });

    });
};

SK.moduleConstructors.Settings.prototype.getCss = function() {
    var css = "\
        .options-crumb span,\
        .options-crumb a,\
        .options-crumb div {\
            margin: 0px !important;\
        }\
        .options-crumb span,\
        .options-crumb a {\
            margin-left: 8px !important;\
        }\
        #setting-modal {\
            width: 420px !important;\
            padding: 10px 0px;\
        }\
        #setting-modal h3 {\
            padding: 0 10px !important;\
        }\
        #setting-modal hr {\
            left: auto !important;\
        }\
        #setting-modal .buttons {\
            box-sizing: border-box;\
            padding: 0px 10px;\
        }\
        #setting-modal.scroll {\
            width: 440px;\
        }\
        #setting-modal.scroll > hr {\
            display: none;\
        }\
        #setting-modal.scroll h3 {\
            box-shadow: 0px 4px 6px -2px rgba(0, 0, 0, 0.15);\
            border-bottom: 1px solid #DDD;\
            padding-bottom: 10px !important;\
        }\
        #setting-modal.scroll .content {\
            overflow-x: hidden;\
            overflow-y: scroll;\
        }\
        #setting-modal.scroll .options {\
            width: 100%;\
            padding-right: 20px;\
        }\
        #setting-modal.scroll .buttons {\
            padding-top: 10px;\
            box-shadow: 0px -4px 6px -2px rgba(0, 0, 0, 0.15);\
        }\
        #setting-modal.scroll #settings-form {\
            width: 408px;\
            margin-bottom: 0px;\
        }\
        #setting-modal.scroll .sk-tooltip {\
            display: none;\
        }\
        #settings-button {\
            position: relative;\
                top: 2px;\
        }\
        .settings-spawnkill-version {\
            position: absolute;\
            right: 10px;\
            top: 10px;\
            font-size: 1.2em;\
            color: #BBB;\
        }\
        .sk-button-content.settings {\
            width: 18px;\
            height: 15px;\
            background-image: url('" + GM_getResourceURL("settings") + "');\
            background-position: 1px 0px;\
        }\
        #settings-form {\
            position: relative;\
            width: 420px;\
            margin-bottom: 10px;\
        }\
        #settings-form hr {\
            margin: 0px;\
            position: static;\
        }\
        .main-setting {\
            position: relative;\
            height: 18px;\
            padding: 8px 10px;\
            font-size: 1.2em;\
            color: #666;\
        }\
        .setting .options {\
            max-height: 1000px;\
            overflow: hidden;\
            background-color: #666;\
            box-shadow: \
                inset 0px 11px 6px -10px rgba(0, 0, 0, 0.4),\
                inset 0px -11px 6px -10px rgba(0, 0, 0, 0.4);\
            transition-duration: 300ms;\
            transition-property: max-height;\
        }\
        .setting .option {\
            position: relative;\
            padding: 8px 10px;\
            padding-left: 20px;\
            color: #EEE;\
            border-bottom: solid 1px #888;\
        }\
        .setting .options.fold {\
            max-height: 0px !important;\
        }\
        #settings-form .slide-toggle {\
            position: absolute;\
            right: 34px;\
            top: 5px;\
        }\
        #settings-form .option .slide-toggle {\
            right: 6px;\
            top: 4px;\
            width: 30px;\
            height: 18px;\
        }\
        #settings-form .option .slide-toggle :checked + .slide-toggle-style:after {\
            left: 14px;\
        }\
        #settings-form .option .slide-toggle input + .slide-toggle-style:after {\
            left: 2px;\
            top: 2px;\
            width: 14px;\
            height: 14px;\
        }\
        #settings-form .option .sk-dropdown {\
            position: absolute;\
                top: 6px;\
                right: 6px;\
        }\
        .subsettings-button {\
            position: absolute !important;\
            right: 10px;\
        }\
        #settings-form .option .sk-button {\
            float: right;\
            top: -4px;\
            right: -4px;\
        }\
        #settings-form .option .sk-button-content {\
            padding: 4px 6px;\
            font-size: 0.9em;\
        }\
    ";
    return css;
};
