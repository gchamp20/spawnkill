"use strict";
/* jshint multistr: true */
/* jshint newcap: false */

/* Focus sur l'élément sans scroll */
$.fn.focusWithoutScrolling = function() {

    var x = window.scrollX, y = window.scrollY;
    this.focus();
    window.scrollTo(x, y);
    return this;
};

/* Scroll à l'élément concerné avec une animation, appelle le callback à la fin du scroll */
$.fn.scrollThere = function(delay, callback) {

    delay = delay || 300;

    $("html, body").animate({
            scrollTop: $(this).offset().top
        }, delay, function() {

            if(typeof callback === "function") {
                callback();
            }
        }
    );

  return this;
};

/**
 * Retourne true si l'élément est visible à l'écran.
 * @param {boolean} partial Quand true, on retourne true si l'élément est partiellement visible
 * @return {boolean} true si l'élément est visible
 */
$.fn.isVisibleOnScreen = function(partial) {

    var $this = $(this);
    var $window = $(window);
    var windowHeight = $window.height();
    var viewTop = $window.scrollTop();
    var viewBottom = viewTop + windowHeight;
    var _top = $this.offset().top;
    var _bottom = _top + $this.height();
    var compareTop = partial ? _bottom : _top;
    var compareBottom = partial ? _top : _bottom;

    return (compareBottom <= viewBottom) && (compareTop >= viewTop);

};


/**
 * @param {float} coefficient Si renseigné, la fonction retourne true quand
 *   la hauteur de l'élément dépasse <coefficient> * la hauteur de l'écran
 * @return {boolean} true si l'élément est plus haut que l'écran
 */
$.fn.isOversized = function(coefficient) {

    coefficient = coefficient || 1;

    var elementHeight = $(this).outerHeight();
    var windowHeight = $(window).height();
    var maxHeight = windowHeight * coefficient;

    return elementHeight > maxHeight;
};

/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * <jevin9@gmail.com> wrote this file. As long as you retain this notice you
 * can do whatever you want with this stuff. If we meet some day, and you think
 * this stuff is worth it, you can buy me a beer in return. Jevin O. Sewaruth
 * ----------------------------------------------------------------------------
 *
 * Autogrow Textarea Plugin Version v3.0
 * http://www.technoreply.com/autogrow-textarea-plugin-3-0
 *
 * THIS PLUGIN IS DELIVERD ON A PAY WHAT YOU WHANT BASIS. IF THE PLUGIN WAS USEFUL TO YOU, PLEASE CONSIDER BUYING THE PLUGIN HERE :
 * https://sites.fastspring.com/technoreply/instant/autogrowtextareaplugin
 *
 * Date: October 15, 2012
 */
jQuery.fn.autoGrow = function() {
    return this.each(function() {

        var createMirror = function(textarea) {
            $(textarea).after("<div class=\"autogrow-textarea-mirror\"></div>");
            return $(textarea).next(".autogrow-textarea-mirror")[0];
        };

        var sendContentToMirror = function (textarea) {
            mirror.innerHTML = String(textarea.value)
                .replace(/&/g, "&amp;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#39;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/ /g, "&nbsp;")
                .replace(/\n/g, "<br />") +
                ".<br/>."
            ;

            if ($(textarea).height() != $(mirror).height()) {
                $(textarea).height($(mirror).height());
            }
        };

        var growTextarea = function () {
            sendContentToMirror(this);
        };

        var mirror = createMirror(this);

        mirror.style.display = "none";
        mirror.style.wordWrap = "break-word";
        mirror.style.whiteSpace = "normal";
        mirror.style.padding = $(this).css("padding");
        mirror.style.width = $(this).css("width");
        mirror.style.fontFamily = $(this).css("font-family");
        mirror.style.fontSize = $(this).css("font-size");
        mirror.style.lineHeight = $(this).css("line-height");

        // Style the textarea
        this.style.overflow = "hidden";
        this.style.minHeight = this.rows + "em";

        // Bind the textarea's event
        this.onkeyup = growTextarea;

        // Fire the event for text already present
        sendContentToMirror(this);

    });
};
