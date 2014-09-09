"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/**
 * HilightNewTopic : met en valeur les topics sans réponses
 * 
 */
SK.moduleConstructors.HilightNewTopic = SK.Module.new();

SK.moduleConstructors.HilightNewTopic.prototype.id = "HilightNewTopic";
SK.moduleConstructors.HilightNewTopic.prototype.title = "Mise en avant des nouveaux topics";
SK.moduleConstructors.HilightNewTopic.prototype.description = "Permet de voir facilement les nouveaux topics dans la liste des sujets";

SK.moduleConstructors.HilightNewTopic.prototype.init = function() {
    this.hilightNewTopic();
};

/* Change l'icone des topics avec 0 posts */
SK.moduleConstructors.HilightNewTopic.prototype.hilightNewTopic = function() {

    var self = this;

    $("#liste_topics tr td:nth-child(4)").each(function() {

        var $postCount = $(this);

        self.queueFunction(function() {

            if(parseInt($postCount.html().trim()) === 0) {
                //On remplace l'image du topic, sauf si c'est une épingle
                $postCount.parent().find("img[src='http://image.jeuxvideo.com/pics/forums/topic_dossier1.gif']")
                    .attr("src", GM_getResourceURL("newTopic"))
                    .addClass("new-topic");
            }

        }, this);
    });
};


SK.moduleConstructors.HilightNewTopic.prototype.shouldBeActivated = function() {
    return SK.Util.currentPageIn(SK.common.Pages.TOPIC_LIST);
};