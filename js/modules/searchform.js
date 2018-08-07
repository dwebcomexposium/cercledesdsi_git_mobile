/**!
 Search Form
 Search form

 @contributors: Geoffrey Crofte (Alsacréations), Rodolphe (Alsacréations)
 @date-created: 2015-04-01
 @last-update: 2015-05-22
 */

;(function($) {

  $.cxpSearchform = function(el, options) {

    var defaults = {};

    var plugin = this;

    plugin.settings = {};

    var $element = $(el),
      element = el;

    // Plugin initialization
    plugin.init = function() {
      plugin.settings = $.extend({}, defaults, options);
      updateSettingsFromHTMLData();
      registerEvents();
    };

    // Reads plugin settings from HTML data-* attributes (camelCase)
    var updateSettingsFromHTMLData = function() {
      var data = $element.data();
      for (var dat in data)
        plugin.settings[dat] = data[dat];
    };

    // Event Handlers on HTML components inside the plugin
    var registerEvents = function() {

      $element.each(function() {

        var $_this = $(this),
          $target = $_this.find('.js-toggle-target');

        // Button to display search, only on pages with .site-banner
        if ($_this.closest('.site-banner').length > 0) {

          // Button creation
          //$target.before('<button class="gsf-trigger js-toggle-trigger unstyled" type="button" title="' + $target.data('title') + '"><i class="icon icon-search" aria-hidden="true"></i><span class="gsf-trigger-text visually-hidden">' + $target.data('trigger-text') + '</span></button>');

          $_this.find('.js-toggle-trigger').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $target = $(this).closest('.js-gsf');
            $target.toggleClass('is-visible');
            if ($target.hasClass('is-visible')) {
                  $target.find('input#search').focus();
              }
            return false;
          });
          $_this.on('click', '.js-to-close', function(e){
              e.preventDefault();
          });
          $target.find('input#search').on('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
            return false;
          });
          $target.find('input#search').on('focus', function() {
            $(this).closest('.gsf-input-line').addClass('is-focused');
            return false;
          });
          $target.find('input#search').on('blur', function() {
            $(this).closest('.gsf-input-line').removeClass('is-focused');
            return false;
          });
          // disappear when click out
          $('body').on('click', function() {
            if ($_this.find('.js-toggle-trigger').closest('.js-gsf').hasClass('is-visible')) {
              $_this.find('.js-toggle-trigger').closest('.js-gsf').toggleClass('is-visible');
              if ($_this.find('.js-toggle-trigger').hasClass('text-only')) {
                $_this.find('.js-toggle-trigger').toggleClass('text-only');
                $_this.find('.js-toggle-trigger').closest('.js-gsf').find('input#search').val('');
                $_this.find('.js-toggle-trigger').attr('title', 'Déplier la recherche');
              }
            }
          });

        }

        var remoteurl = $(this).find('meta[itemprop=target]').prop('content');

        // Typeahead config
        var lastArticles = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("title"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: 'inc/json/search-results-sample.json', // @TOPROD
            remote: {
              url: remoteurl,
              wildcard: '{search}'
            }
          }),
          lastExhibitors = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("title"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: 'inc/json/search-results-sample.json', // @TOPROD
            remote: {
              url: remoteurl,
              wildcard: '{search}'
            }
          }),
          lastProducts = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("title"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: 'inc/json/search-results-sample.json', // @TOPROD
            remote: {
              url: remoteurl,
              wildcard: '{search}'
            }
          }),
          lastEvents = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace("title"),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            prefetch: 'inc/json/search-results-sample.json', // @TOPROD
            remote: {
              url: remoteurl,
              wildcard: '{search}'
            }
          }),
          suggestTemplate = '<p><span class="tt-suggest-img"><img src="{{image}}" alt="" width="31" height="31"></span><span class="tt-suggest-text">{{title}}</span></p>',
          $_the_input = $_this.find('.gsf-input'),
          langSuggestionText = $_the_input.data('suggestion-text');

        lastArticles.initialize();
        lastExhibitors.initialize();
        lastProducts.initialize();
        lastEvents.initialize();

        $_the_input.typeahead({
          hint: true,
          highlight: true,
          minLength: 3
        }, {
          name: 'articles',
          displayKey: 'title',
          source: lastArticles.ttAdapter(),
          templates: {
            header: '<span class="typeahead-section-name">Articles</span>',
            suggestion: Handlebars.compile(suggestTemplate)
          }
        }, {
          name: 'exposants',
          displayKey: 'title',
          source: lastExhibitors.ttAdapter(),
          templates: {
            header: '<span class="typeahead-section-name">Exposants</span>',
            suggestion: Handlebars.compile(suggestTemplate)
          }
        }, {
          name: 'produits',
          displayKey: 'title',
          source: lastProducts.ttAdapter(),
          templates: {
            header: '<span class="typeahead-section-name">Produits</span>',
            suggestion: Handlebars.compile(suggestTemplate)
          }
        }, {
          name: 'evenements',
          displayKey: 'title',
          source: lastEvents.ttAdapter(),
          templates: {
            header: '<span class="typeahead-section-name">Évènements</span>',
            suggestion: Handlebars.compile(suggestTemplate)
          }
        });

        $_the_input.on('typeahead:opened', function() {
          if ($(this).nextAll('.tt-dropdown-menu').find('.tt-text-intro').length === 0) {
            $(this).nextAll('.tt-dropdown-menu').prepend('<span class="tt-text-intro">' + langSuggestionText + '</span>');
          }
        });

      });

      // Sticky things on scroll (gc)
      var gsf_scrolltimer,
        gsf_menuInitPos = $('.site-banner').outerHeight(), //gc
        $headerSearch = $('.body-visual .site-banner .js-gsf'); // gc

      if ($headerSearch.length > 0) {

        var $trigger = $('.js-toggle-trigger', $element);

        var $searchfield = $('[name=search]', $headerSearch);
        $searchfield.on('keyup', function() {
          $trigger.toggleClass('text-only', $(this).val().length > 0);
        });

        window.addEventListener('scroll', function() {

          clearTimeout(gsf_scrolltimer);
          gsf_scrolltimer = setTimeout(function() {

            if ($(window).scrollTop() >= gsf_menuInitPos) {

              $trigger.attr('title', 'Déplier la recherche');
              $trigger.on('click.cxpnosearch', function(e) {
                var $searchfield = $('[name=search]', $element);
                var searchvalue = $searchfield.val();
                if (searchvalue.length > 0) {
                  $(this).closest('form').trigger('submit');
                }
                e.preventDefault();
              });

            } else {

              $trigger.off('click.cxpnosearch').attr('title', 'Lancer la recherche');

            }

          }, 30);
        }, true);
      }
    };

    plugin.init();

  };

  $.fn.cxpSearchform = function(options) {

    return this.each(function() {
      if (undefined === $(this).data('cxpSearchform')) {
        var plugin = new $.cxpSearchform(this, options);
        $(this).data('cxpSearchform', plugin);
      }
    });

  };

  $('.cxp-searchform').cxpSearchform();

})(jQuery);
