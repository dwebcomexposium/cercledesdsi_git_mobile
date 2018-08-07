/**!
Gestion du product selector
interaction in the porduct selector block

@contributors: Guillaume Focheux (Alsacréations)
@date-created: 2015-09-03
@last-update: 2015-09-03
*/

;(function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = 'sialProductSelector',
    defaults = {
        //Options Plugin Here
    },
    $_defaultClasses = {
        //default class of icon prev next
    },
    $handFade = false;

    // The actual plugin constructor
    function sialProductSelector(_caller, options) {
        this._caller = _caller;
        this.$caller = $(_caller);
        //options override
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        // initialization
        this.init();
    }

    //Prototype of the object
    sialProductSelector.prototype = {
        init: function() {
            var _self = this;
            _self.binding();
            return _self;

        },
        binding: function() {
            var _self = this;
            _self.$caller.on('mouseenter.sps focus.sps','.ps-list-link' ,_self.spsAction );
            _self.$caller.on('mouseleave.sps blur.sps',_self.spsExit );
        },
        // toggle to cart image
        spsAction: function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $_link = $(this),
            $_self = $_link.closest('.products-sectors'),
            $container = $_self.find('.ps-illust-container'),
            $productIconContainer = $_self.find('.ps-illust-product-icon'),
            $iconPrev = $productIconContainer.find('.ps-illust-icon-prev'),
            $iconNext = $productIconContainer.find('.ps-illust-icon-next'),
            firstEnter = false;

            //slide cart for see good looking icon
            if( ! $container.hasClass('js-action') ){
                $container.addClass('js-action');
                firstEnter = true;
            }
            if( $_defaultClasses.iconPrev === undefined ) {
                $_defaultClasses = {
                    "iconPrev" : $iconPrev.attr('class'),
                    "iconNext" : $iconNext.attr('class')
                };
            }
            iconCurrentClass = $_link.find('.icon').first().attr('class');
            // if not need hand with tje picto
            if($_link.attr('data-sps-nosub') !== undefined ){
                $container.find('.ps-illust-sub-icon').fadeOut(500);
            } else {
                $container.find('.ps-illust-sub-icon').fadeIn(500);
            }
            if( !firstEnter ){
                // Update icon
                if( $_defaultClasses.iconNext+' '+ iconCurrentClass !== $iconNext.attr('class') ){
                    $iconNext.attr('class', $_defaultClasses.iconNext );
                    $iconNext.addClass( iconCurrentClass );
                } else {
                    return this;
                }
                // slide icon
                $productIconContainer.addClass('js-action');

                // delay the change of
                setTimeout( function(){
                    $productIconContainer.removeClass('js-action');
                    $iconPrev.attr( 'class', $iconNext.attr('class') ).removeClass('ps-illust-icon-next').addClass('ps-illust-icon-prev');
                }, 500);


            } else {
                // if not need hand with tje picto
                $iconPrev.addClass( iconCurrentClass );
            }


            return this;
        },
        spsExit: function(){
            var $_self = $(this),
            $container = $_self.find('.ps-illust-container'),
            $productIconContainer = $_self.find('.ps-illust-product-icon'),
            $iconPrev = $productIconContainer.find('.ps-illust-icon-prev'),
            $iconNext = $productIconContainer.find('.ps-illust-icon-next');
            $container.removeClass('js-action');
            setTimeout( function(){
                $container.find('.ps-illust-sub-icon').hide();
                $iconNext.attr('class', $_defaultClasses.iconNext );
                $iconPrev.attr('class', $_defaultClasses.iconPrev );

            }, 500);
            return this;
        }
    };

    // Instanciate the plugin and put it in a variable
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, pluginName)) {
                $.data(this, pluginName, new sialProductSelector(this, options));
            }
        });
    };

    if ($('.products-sectors').length > 0) {
        $('.products-sectors').sialProductSelector();
    }

})(jQuery, window, document);
