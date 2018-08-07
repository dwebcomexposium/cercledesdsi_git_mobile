/**!
 Mobile Navigation
 Sublevel touch dropdown navigation

 @contributors: Damien Senger (Alsacréations)
 @date-created: 2015-06-18
 @last-update: 2015-06-18
 */

;(function ($) {

	$.fn.toggleSlideNav = function (options) {

		var settings = $.extend({
			speed: 200
		}, options);

		return this.each(function () {
			var $_this = $(this),
				$trigger = $(this),
				$target = $('.main-navigation');

			$trigger.on('click.tsn', function () {

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
			$target.on('click.tsn', function (e) {
				e.stopPropagation();
			});
			$('body').on('click', function (e) {
				if ($_this.hasClass('is-open')) {
					$trigger.trigger('click.tsn');
				}
			});
		});

	};

	$('.sb-menu-trigger').toggleSlideNav();

})(jQuery);
