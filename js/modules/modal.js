/*!
 jQuery modal/lightbox plugin
 @name modal.js
 @author Alsacreations (@alsacreations)
 @version 1.0
 @date 27/05/2015
 @category jQuery Plugin
 @copyright (c) 2015 Alsacréations
 @license Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

(function($) {

    "use strict";
    var cxpModal, defaultOptions, modalBind;

    modalBind = function(fn, me) {
        return function() {
            return fn.apply(me, arguments);
        };
    };

    // Plugin default options
    defaultOptions = {
        // jQuery formatted selector to search for focusable items
        focusableElementsString: "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, targetect, embed, *[tabindex], *[contenteditable]",
        // store the item that has focus before opening the modal window
        focusedElementBeforeModal: undefined,
        resizeDelay: 50
    };

    cxpModal = (function(options) {

        // Constructor
        function cxpModal(handler, options) {

            // plugin variables
            this.handler = handler;
            this.modaltarget = false;
            this.resizeTimer = null;

            // Extend default options
            $.extend(true, this, defaultOptions, options);

            // Bind methods.
            this.update = modalBind(this.update, this);
            this.onResize = modalBind(this.onResize, this);
            this.init = modalBind(this.init, this);
            this.clear = modalBind(this.clear, this);

        }

        // Method for updating the plugins options
        cxpModal.prototype.update = function(options) {
            $.extend(true, this, options);
        };

        // Init
        cxpModal.prototype.init = function() {

            // Closure
            var self = this;

            // Events...
            $('body').on('click.cxpModal', this.handler.selector, function(e) {
                // Update modal target related to the handler (link)
                self.modaltarget = $($(this).data('modaltarget'));
                // Call to show the modal
                self.showModal();
                if (e !== undefined) {
                    e.preventDefault();
                }
            });

        };

        // Close method
        cxpModal.prototype.closeModal = function() {

            // Hide & mark the modal window as hidden
            this.modaltarget.hide().attr('aria-hidden', 'true');

            // Destroy all overlay
            $('.overlay').remove();

            // START custom selectors
            // mark the main page as visible
            $('body, .footer').attr('aria-hidden', 'false');
            // END custom

            // set focus back to element that had it before the modal was opened
            if (this.focusedElementBeforeModal !== undefined && this.focusedElementBeforeModal.length > 0) {
                this.focusedElementBeforeModal.focus();
            }

            // Destroy key events
            $('body').off('keydown.cxpmodal');

        };

        // Resize method
        cxpModal.prototype.onResize = function() {
            // Closure
            var self = this;
            var $target = this.modaltarget;

            // modal reduce if window width or height too little

            var windowSize = {
                "w": window.innerWidth - 50,
                "h": window.innerHeight - 50,
            };
            // console.clear();
            // console.log("windows = " + windowSize.h + "/" + windowSize.w);
            // console.log("modals = " + $target.height() + '/' + $target.width());

            var modalSize = $target.data('MaxSize'),
                modalHeight = modalSize.h,
                modalWidth = modalSize.w,
                newWidth = modalWidth,
                newHeight = modalHeight,
                ratio = 1;


            if (windowSize.h < modalHeight) {
                newHeight = windowSize.h;
                ratio = windowSize.h / modalHeight;
                newWidth = modalWidth * ratio;

                // Adjust for width too large
                if (newWidth > windowSize.w) {
                    newHeight = (windowSize.w / newWidth) * newHeight;
                    newWidth = windowSize.w;
                }

            } else if (modalWidth > windowSize.w) {
                newHeight = (windowSize.w / modalWidth) * modalHeight;
                newWidth = windowSize.w;
                // Adjust for width too large
                if (newHeight > windowSize.h) {
                    newWidth = (windowSize.h / newHeight) * newWidth;
                    newHeightWidth = windowSize.h;
                }
            }

            $target.height(newHeight);
            $target.width(newWidth);

            // modal center
            $target.css("top", 0);
            $target.css("margin-top", function() {
                return ($(window).height() - $target.height()) / 2;
            });
            $target.css("margin-left", function() {
                return 0 - ($target.width() / 2);
            });
        };
        // Main method
        cxpModal.prototype.showModal = function() {

            // Closure
            var self = this;

            //Store the predefined Modal size
            this.modaltarget.data('MaxSize', {
                "h": this.modaltarget.height(),
                "w": this.modaltarget.width()
            });

            // resize on show
            self.onResize();

            // Show the element
            this.modaltarget.show().attr('aria-hidden', 'false');


            // Bugfix for Nexus 7 and other smartphones when scrolling in modal
            $('body').addClass('bfc');

            // Set the events
            this.modaltarget.find('.m-btn-to-close').on({
                'click': function(e) {
                    self.closeModal();
                    if (e !== undefined) {
                        e.preventDefault();
                    }
                },
                'keydown': function(e) {
                    self.trapSpaceKey($(this), e, function() {
                        self.closeModal();
                    });
                }

            });
            this.modaltarget.find('.m-trigger-close').on({
                'click': function(e) {
                    self.closeModal();
                    if (e !== undefined) {
                        e.preventDefault();
                    }
                },
                'keydown': function(e) {
                    self.trapSpaceKey($(this), e, function() {
                        self.closeModal();
                    });
                }

            });
            this.modaltarget.on('keydown', function(event) {
                self.trapTabKey($(this), event);
                self.trapEscapeKey($(this), event);
            });

            // Bonus : Keydown events for swipers !
            $('body').on('keydown.cxpmodal', function(e) { // Keyboard
                var $swiper = $('.cxp-swiper', self.modaltarget);
                if ($swiper.length > 0) {
                    if (e.keyCode == 37) {
                        $swiper.data('cxpSwiper').swipePrev();
                    } else if (e.keyCode == 39) {
                        $swiper.data('cxpSwiper').swipeNext();
                    }
                }
            });

            // save the current focus
            this.focusedElementBeforeModal = $(':focus');

            // insert an overlay to prevent clicking and make a visual change to indicate the main page is not available
            if ($('.overlay').length < 1) {
                $('body').append('<div class="overlay" tabindex="-1"></div>');
                $('.overlay').addClass('is-open');
                // A click on overlay (outside modal) closes all of the modals
                $('.overlay').fadeIn().on('click', function() {
                    $(this).removeClass('is-open');
                    $('.m-btn-to-close').trigger('click');
                });
            }

            // START custom selectors & settings

            // Mark the main page as hidden
            $('body, .footer').attr('aria-hidden', 'true');

            // Managing modal when its content is too tall to fit into viewport
            // var modalHeightModal = this.modaltarget.height();
            var modalHeightModalTitle = this.modaltarget.find('.modal-header').height();

            // Keep min-height: 528px on .modal-content or not? (0.8 = 100% - top:10% - bottom:10%)
            if (($(window).height() * 0.8) - modalHeightModalTitle < 528) {
                this.modaltarget.find('.modal-content').addClass('js-no-minheight');
            }

            // var modalHeightModalContent = this.modaltarget.find('.modal-content').height();

            // 2 type of modals are managed: with Tabs and Pane (then each Pane can have a scrollbar) or without (general case: content can have a scrollbar)
            var modalHeightModalTabs = 0;
            if (this.modaltarget.find('.tabstrip-tabs').length > 0) {
                modalHeightModalTabs = this.modaltarget.find('.tabstrip-tabs').height();
                this.modaltarget.find('.tabstrip-pane').css('top', modalHeightModalTabs + modalHeightModalTitle + 15); // @NOTE 15 is the top padding on Tabs
            }


            $(window).resize(function() {
                self.onResize();
            });

            // END custom

            // Safari and VoiceOver shim
            // if VoiceOver in Safari is used, set the initial focus to the modal window itself instead of the first keyboard focusable item.
            // This causes VoiceOver to announce the aria-labelled attributes. Otherwise, Safari and VoiceOver will not announce the labels attached to the modal window.

            // set the focus to the first keyboard focusable item
            this.modaltarget.find('*').filter(this.focusableElementsString).filter(':visible').first().focus();

        };


        cxpModal.prototype.trapSpaceKey = function(target, e, f) {
            if (e.which === 32) { // if space key pressed
                f(); // fire the user passed event
                e.preventDefault();
            }
        };

        cxpModal.prototype.trapEscapeKey = function(target, e) {
            if (e.which === 27) { // if escape pressed
                target.find('.m-btn-to-close').trigger('click');
                e.preventDefault();
            }
        };

        cxpModal.prototype.trapTabKey = function(target, e) {

            // if tab or shift-tab pressed
            if (e.which === 9) {

                // get list of focusable items
                var focusableItems = target.find('*').filter(this.focusableElementsString).filter(':visible');

                // get currently focused item
                var focusedItem = $(':focus');

                // get the number of focusable items
                var numberOfFocusableItems = focusableItems.length;

                // get the index of the currently focused item
                var focusedItemIndex = focusableItems.index(focusedItem);

                if (e.shiftKey) {
                    // back tab
                    // if focused on first item and user preses back-tab, go to the last focusable item
                    if (focusedItemIndex === 0) {
                        focusableItems.get(numberOfFocusableItems - 1).focus();
                        e.preventDefault();
                    }

                } else {
                    // forward tab
                    // if focused on the last item and user preses tab, go to the first focusable item
                    if (focusedItemIndex === (numberOfFocusableItems - 1)) {
                        focusableItems.get(0).focus();
                        e.preventDefault();
                    }
                }
            }

        };

        return cxpModal;

    })();

    $.fn.cxpModal = function(options) {

        // Create a cxpModal instance if not available
        if (!this.cxpModalInstance) {
            this.cxpModalInstance = new cxpModal(this, options || {});
        } else {
            this.cxpModalInstance.update(options || {});
        }

        // Init plugin
        this.cxpModalInstance.init();

        // Display items (if hidden) and return jQuery object to maintain chainability
        return this;

    };

})(jQuery);

// Launch
jQuery(document).ready(function($) {
    "use strict";
    $('.modalopen').cxpModal();
});
