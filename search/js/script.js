/* jshint -W117 */
'use strict';

/**
 * Widget istexSearch
 */
;(function ($, window, document, undefined) {

  var pluginName = "istexSearch";
  var defaults = {
    istexApi: 'https://api.istex.fr',
    query: ""
  };

  // The actual plugin constructor
  function Plugin(element, options) {
    this.elt = element;
    this.settings = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype.init = function () {
    var self = this;

    /*jshint ignore:start*/
    // insert the form search into the DOM
    $(self.elt).append(
      '<form class="istex-search-form">' +
        '<div class="istex-search-bar-wrapper">' +
          '<input class="istex-search-submit" type="submit" value="Rechercher" />' +
          '<span>' +
            '<input class="istex-search-input" type="text" value="" placeholder="Votre requête ici ..." />' +
          '</span>' +
        '</div>' +
        '<p class="istex-search-error">error</p>' +
      '</form>'
    );
    /*jshint ignore:end*/

    // initialize query parameter
    $(self.elt).find('.istex-search-input').val(self.settings.query);

    // connect the submit action
    $(self.elt).find('.istex-search-form').submit(function () {

      // send the request to the istex api with the
      // jquery-jsonp lib because errors are not
      // handled by the native jquery jsonp function
      $.jsonp({
        url: self.settings.istexApi + '/document/',
        data: { q: $(self.elt).find('input.istex-search-input').val() },
        callbackParameter: "callback",
        success: function(items) {
          console.log(items);
          // hide the error box
          $(self.elt).find('.istex-search-error').hide();
          // forward the results as a DOM event
          $(self.elt).trigger('istex-results', [ self, items ]);
          // forward the results as a global event
          $.event.trigger('istex-results', [ self, items ]);
        },
        error: function (opt, err) {
          $(self.elt).find('.istex-search-error').html('<a href="https://api.istex.fr/document/?q=*">API Istex</a> non joignable.');
          $(self.elt).find('.istex-search-error').show();
        }
      });

      return false;
    });

  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[ pluginName ] = function (options) {
    this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, options));
      }
    });
    return this;
  };

})(jQuery, window, document);