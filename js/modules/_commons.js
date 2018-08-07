/**!
 COMMONS
 All commons function merged to generics jQuery plugins

 @contributors: Guillaume Focheux (Alsacréations)
 @date-created: 2015-03-26
 @last-update: 2015-08-28
 */

;(function ($) {

	//
	// Plugin Name
	// @Description: Do something to create good interaction
	//

	$.fn.plugin_name = function (options) {

		var settings = $.extend({
			param_name: "param_value",
			param_name2: "param_value2"
		}, options);

		return this.each(function () {

		});

	};


	//
	// Toggle Slide
	// @Description: Toggle slide the targetted element
	// @Parameters: speed (int, ms)
	//

	$.fn.toggleSlide = function (options) {

		var settings = $.extend({
			speed: 200
		}, options);

		return this.each(function () {
			var $_this = $(this),
				$trigger = $(this).find('.js-toggle-trigger'),
				$target = $(this).find('.js-toggle-target');

			$trigger.on('click.ts', function () {

				if ($_this.hasClass('is-open')) {
					$target.stop().slideUp(settings.speed);
					$_this.removeClass('is-open');

				}
				else {
					$target.stop().slideDown(settings.speed);
					$_this.addClass('is-open');

				}

				return false;
			});
			$target.on('click.ts', function (e) {
				e.stopPropagation();
			});
			$('body').on('click', function (e) {
				if ($_this.hasClass('is-open')) {
					$trigger.trigger('click.ts');
				}
			});
		});

	};


	//
	// Toggle Fade
	// @Description: Toggle fade the targetted element
	// @Parameters: speed (int, ms)
	//

	$.fn.toggleFade = function (options) {

		var settings = $.extend({
			speed: 200
		}, options);

		return this.each(function () {
			var $_this = $(this),
				$trigger = $(this).find('.js-toggle-trigger'),
				$target = $(this).find('.js-toggle-target');

			$trigger.on('click.ts', function () {

				if ($_this.hasClass('is-visible')) {
					$target.stop().fadeIn(settings.speed);
					$_this.removeClass('is-visible');

				}
				else {
					$target.stop().fadeOut(settings.speed);
					$_this.addClass('is-visible');
				}

				return false;
			});
			$target.on('click.ts', function (e) {
				e.stopPropagation();
			});
		});

	};
	// function for Copy element somewhere else
	$.fn.elemCopy = function () {

		return this.each(function () {
			var $_this = $(this),
				$target = $($(this).data('copyTarget')),
				position = $(this).data('copyPosition'),
				$copy = $_this.clone();

			$copy.removeClass('js-elem-copy').removeAttr('data-copy-target').removeAttr('data-copy-position');

			if( position === 'pre'){
				$target.prepend($copy);
			} else {
				$target.append($copy);
			}

		});

	};
	// function to Relocate an element somewhere else
	$.fn.relocate = function () {

		return this.each(function () {
			var $_this = $(this),
				$target = $($(this).data('relocateTarget')),
				position = $(this).data('relocatePosition'),
				$elem = $_this.detach();

			$elem.removeClass('js-elem-relocate').removeAttr('data-relocate-target').removeAttr('data-relocate-position');

			if( position === 'before'){
				$target.prepend($elem);
			} else {
				$target.append($elem);
			}

		});

	};

	// add Button
	if( $('.js-gsf').length > 0){
		var toAdd = '<span class="gsf-fields-title">Que recherchez vous ?</span><button class="btn-gsf-fields-close js-to-close"><i class="icon icon-cross"></i><span class="visually-hidden">Fermer la recherche</span></button>';
		$('.js-gsf .js-toggle-target').prepend(toAdd);
	}

	// Copy elem in other
	if($('.js-elem-copy').length > 0){
		$('.js-elem-copy').elemCopy();
	}

	// Item elem in other
	if($('.js-elem-relocate').length > 0){
		$('.js-elem-relocate').elemCopy();
	}
	if(  $('.press-releases .link-view-all').length > 0){
		// Relocate without change in HTML press-releases
		var $pressReleaseBtn = $('.press-releases .link-view-all'),
		$pressRelease = $('.press-releases');
		$pressRelease.append( $pressReleaseBtn.detach() ) ;
	}

	// Scrool To "voir plus"

	$('.site-banner .hi-link').on('click', function(){
		var speed = 750; // Durée de l'animation (en ms)
		// Substract 20 pixel for see the next title
		$('html, body').animate( { scrollTop: $(this).offset().top - 20 }, speed ); // Go
		return false;
	});



}(jQuery));
