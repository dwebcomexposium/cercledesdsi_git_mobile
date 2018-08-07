/**!
 Visual Navigation
 Dropdown menu & Mega menu navigation

 @contributors: Guillaume Focheux (Alsacréations), Geoffrey Crofte (Alsacréations), Rodolphe (Alsacréations)
 @date-created: 2015-04-10
 @last-update: 2015-06-01
 */

;
(function($) {

  // Variables
  var $burger = $('.sb-menu-trigger'),
    $mainNav = $('.main-navigation'),
    $closeNav = $('.mn-menu-toclose'),
    $linkInMenu = $('>ul>li.mn-menu-item', $mainNav),
    $headerline = $('.site-banner'),
    menuInitPos = $headerline.outerHeight(), //gc
    scrolltimer; // gc

  // Open navigation
  $burger.on('click', function(e) {
    $mainNav.addClass('mn-visible');
    $('#overlay').addClass('is-open');
  });

  // Close navigation
  $closeNav.on('click', function(e) {
    $mainNav.removeClass('mn-visible');
    // Reset other is-open
    $linkInMenu.removeClass('is-open');
    $('#overlay').removeClass('is-open');
  });

  // Hide/show submenus with pointer
  $linkInMenu.on('click mouseenter', function(e) {
    $('li', $mainNav).removeClass('is-open');
    if ($(this).hasClass('mn-item-has-submenu')) {
      $(this).addClass('is-open');
    }
    $(this).parent('.mn-menu-lvl1').addClass('submenu-is-open');
  });

  // Open navigation when clicking outside (on the overlay)
  $('#overlay').on('click', function() {
    $closeNav.trigger('click');
  });

  // Sticky things on scroll (gc)
  window.addEventListener('scroll', function() {
    clearTimeout(scrolltimer);
    scrolltimer = setTimeout(function() {

      if ($(window).scrollTop() >= menuInitPos) {
        $headerline.addClass('is-stuck');
      } else {
        $headerline.removeClass('is-stuck');
      }

    }, 15);
  }, true);

})(jQuery);
