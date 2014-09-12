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
 * Retourne vrai si l'élément est visible à l'écran.
 * @param {boolean} partial Quand vrai, on retourne vrai si l'élément est partiellement visible
 * @return {boolean} Vrai si l'élément est visible
 */
$.fn.isVisibleOnScreen = function(partial) {

    var $this = $(this),
        $window = $(window),
        windowHeight = $window.height(),
        viewTop = $window.scrollTop(),
        viewBottom = viewTop + windowHeight,
        _top = $this.offset().top,
        _bottom = _top + $this.height(),
        compareTop = partial ? _bottom : _top,
        compareBottom = partial ? _top : _bottom;

    return (compareBottom <= viewBottom) && (compareTop >= viewTop);

};
