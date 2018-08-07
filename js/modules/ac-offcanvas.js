/**!
	Alsacreations Offcanvas
 	Module permettant d'afficher du contenu offcanvas'

 	@contributors: Guillaume Focheux (Alsacréations)
 	@date-created: 2015-08-25
 	@last-update: 2015-08-28
 */

;(function ($, window, document, undefined) {

	// Create the defaults once
	var pluginName = 'acOffCanvas',
		defaults = {
			//Options Plugin Here
		};

	// The actual plugin constructor
	function acOffCanvas(_caller, options) {
		this._caller = _caller;
		this.$caller = $(_caller);
		//options override
		this.options = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		// store value before action for restore state
		this.focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, targetect, embed, *[tabindex], *[contenteditable]";
		this.focusedElementBeforeModal= undefined;
		this._values = {
			'ocTarget': {},
			'ocContainer': {}
		};
		// initialization
		this.init();
	}

	//Prototype of the object
	acOffCanvas.prototype = {
		init: function() {
			var _self = this;
			// get target container
			_self.ocTarget = $(_self.$caller.data('target'));
			if(_self.$caller.data('container') === undefined ) {
				_self.ocContainer = $('body');
			} else {
				_self.ocContainer = $(_self.$caller.data('container'));
			}
			_self.ocOrientation = _self.ocTarget.data('ocOrientation');
			_self.ocTransition = _self.ocTarget.data('ocTransition');
			_self.ocOverlay = _self.ocTarget.data('ocOverlay');
			// transmit ionstance to close button in target container
			_self.ocTarget.find('.ac-offcanvas-close').data(pluginName,_self);

			_self.binding();
			return _self;
		},
		binding: function() {
			var _self = this;
			_self.$caller.on('click.ac-oc', _self.toggle );
			_self.ocTarget.on('click.ac-oc', '.ac-offcanvas-close' ,_self.toggle );

			_self.ocTarget.on('keydown', function(event) {
	                _self.trapTabKey($(this), event);
	                _self.trapEscapeKey($(this), event);
	                _self.trapSpaceKey($(this), event);
	            });
			// BUGFIX for iPad/Phone/Pod scroll glitch
			if( /iP(ad|hone|od)/.test(navigator.userAgent) ){
				_self.ocContainer.on('scroll.ac-oc', _self.iScrollFix );
			}
		},
		// action Open
		ocOpen: function() {
			var _self = this;
			_self.ocTarget.addClass('ac-oc-open');
			_self._values.ocTarget.style = _self.ocTarget.attr('style');
			_self._values.ocContainer.style = _self.ocContainer.attr('style');

			if( /MSIE 9/i.test(navigator.userAgent) ||  /MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) ){
					_self.ocTarget.addClass('ac-oc-iefix');
					_self.ocContainer.addClass('ac-oc-container-iefix');
			} else {
				if( _self.ocOrientation ==='left' || _self.ocOrientation ==='right' ){
					_self.ocTarget.css('top',$(window).scrollTop()+'px');
				}
			}
			_self.ocContainer.addClass('ac-offcanvas-container');
			_self.ocContainer.css('transition','transform 0.5s '+_self.ocTransition).css('-webkit-transform', _self.calcTranslate() ).css('-ms-transform', _self.calcTranslate() ).css('transform', _self.calcTranslate() );
			if( _self.ocOverlay !== undefined ){
				_self.addOverlay();
			}
			//define previous focus
			_self.focusedElementBeforeModal = $(':focus');
			//give focus on the first element in le offcanvas
			_self.ocTarget.find('*').filter(this.focusableElementsString).filter(':visible').first().focus();

			// block Space
			$('body').on('keydown.ac-oc', function(event) {
	                _self.trapTabKey($(this), event);
	                _self.trapEscapeKey($(this), event);
	                _self.trapSpaceKey($(this), event);
	            });

			return this;
		},
		// action Close
		ocClose: function() {
			var _self = this;
			if( _self.ocOverlay !== undefined ){
				_self.removeOverlay();
			}

			_self.ocContainer.css('transition','transform 0.5s '+_self.ocTransition).css('-webkit-transform', 'translate(0,0)' ).css('-ms-transform','translate(0,0)').css('transform','translate(0,0)');
			setTimeout(function(e){
				_self.ocContainer.removeClass('ac-offcanvas-container');
			},1000);
			_self.ocTarget.removeClass('ac-oc-open');
			_self.ocTarget.removeClass('ac-oc-iefix');
			_self.ocContainer.removeClass('ac-oc-container-iefix');
			if( _self._values.ocTarget.style === undefined ){
				_self.ocTarget.removeAttr('style');
			} else {
				_self.ocTarget.prop('style', _self._values.ocTarget.style );
			}
			if( _self._values.ocContainer.style === undefined ){
				_self.ocContainer.removeAttr('style');
			} else {
				_self.ocContainer.prop('style', _self._values.ocContainer.style );
			}
			// set focus back to element that had it before the modal was opened
            if (_self.focusedElementBeforeModal !== undefined && _self.focusedElementBeforeModal.length > 0) {
                //_self.focusedElementBeforeModal.focus();
            }

			$('body').off('keydown.ac-oc');

			return _self;
		},// toggle
		toggle: function(e) {
			e.preventDefault();
			e.stopPropagation();
			var _self = $(this).data(pluginName);

			if( ! $(_self.ocTarget).hasClass('ac-oc-open')){
				_self.ocOpen();
			} else {
				_self.ocClose();
			}
		},
		calcTranslate: function(e) {
			var _self = this;
			switch (_self.ocOrientation) {
				case 'top':
					return 'translate(0, '+ _self.ocTarget.height() +'px )';
				case 'right':
					return 'translate(-'+ _self.ocTarget.width() +'px ,0)';
				// @TOFIX bottom doesn't work
				// case 'bottom':
				// 	return 'translate(0, -'+ _self.ocTarget.height() +'px )';
				default:
					return 'translate('+ _self.ocTarget.width() +'px ,0)';
			}
		},
		addOverlay: function() {
			var _self = this;
			_self.ocContainer.prepend('<div class="ac-oc-overlay"></div>');
			var $overlay = $('.ac-oc-overlay');
			$overlay.width(_self.ocContainer.width());
			$overlay.height(_self.ocContainer.height());
			$overlay.fadeIn(700);

			$overlay.on('click.ac-oc-overlay', function(){ _self.ocClose(); });
		},
		removeOverlay: function() {
			var _self = this;
			$('.ac-oc-overlay',_self.ocContainer).fadeOut(700);
			setTimeout(function(e){
				$('.ac-oc-overlay',_self.ocContainer).remove();
			},700);
		},
		iScrollFix: function(){
			var _self = this;
			_self.ocTarget.hide.show(0);
		},
		trapSpaceKey : function(target, e, f) {
            if (e.which === 32) { // if space key pressed
                e.preventDefault();
				e.stopPropagation();
            }
        },
		trapEscapeKey : function(target, e) {
            if (e.which === 27) { // if escape pressed
				e.preventDefault();
				_self.ocTarget.find('.ac-offcanvas-close').trigger('click.ac-oc');
            }
        },
		trapTabKey : function(target, e) {

            // if tab or shift-tab pressed
            if (e.which === 9) {
				console.log($(':focus'));
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

        }

	};

	// Instanciate the plugin and put it in a variable
	$.fn[pluginName] = function (options) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				$.data(this, pluginName, new acOffCanvas(this, options));
			}
		});
	};

	if ($('.ac-offcanvas-trigger').length > 0) {
		$('.ac-offcanvas-trigger').acOffCanvas();
	}


})(jQuery, window, document);
