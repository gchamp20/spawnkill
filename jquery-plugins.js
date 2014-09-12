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
 * @param {int} coefficient Si renseigné, la fonction retourne true quand
 *   la hauteur de l'élément dépasse <coefficient>% de la hauteur de l'écran
 * @return {boolean} true si l'élément est plus haut que l'écran
 */
$.fn.isOversized = function(coefficient) {

    coefficient = coefficient || 100;
    coefficient = coefficient / 100;

    var elementHeight = $(this).outerHeight();
    var windowHeight = $(window).height();
    var maxHeight = windowHeight * coefficient;

    return elementHeight > maxHeight;
};