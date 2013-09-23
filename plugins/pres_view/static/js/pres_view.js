/**
 * Description: PresView plugin
 * Copyright (c) 2012 UPMC Sorbonne Universite
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */

(function($){

    var PLUGIN_NAME = 'PresView';

    // routing calls
    jQuery.fn.PresView = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.' + PLUGIN_NAME );
		}    
    };

    /***************************************************************************
     * Public methods
     ***************************************************************************/

    var methods = {

        /**
         * @brief Plugin initialization
         * @param options : an associative array of setting values
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init : function ( options ) {

            return this.each(function() {

                var $this = $(this);

                /* An object that will hold private variables and methods */
                var plugin = new PresView(options);
                $this.data('Manifold', plugin);

                /* Events */
                $this.on('show.' + PLUGIN_NAME, methods.show);

            }); // this.each
        }, // init

        /**
         * @brief Plugin destruction
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        destroy : function( ) {

            return this.each(function() {
                var $this = $(this);
                var plugin = $this.data('Manifold');

                // Unbind all events using namespacing
                $(window).unbind(PLUGIN_NAME);

                // Remove associated data
                plugin.remove();
                $this.removeData('Manifold');
            });
        }, // destroy

        show : function( ) {
            google.maps.event.trigger(map, 'resize');
        } // show

    }; // var methods;

    /***************************************************************************
     * Plugin object
     ***************************************************************************/

    function PresView(options)
    {

        /* member variables */
        this.options = options;

        var object = this;
      
        /**
         *
         */
        this.initialize = function() {
			//APE + no conflit
            j = jQuery.noConflict();
		    ape_initialize();
		    j.getScript('/static/js/config.js');

			// jquery:datepicker
			j(".datepicker").datepicker({
				showOtherMonths: true,
				selectOtherMonths: true,
				showAnim: 'slideDown',
				//regional: 'fr',
				dateFormat: 'dd/mm/yy',
				setDate: -14
			});

			// jquery:accordion
			j("#accordion").accordion({ 
				animated: 'easeslide',
				autoHeight: false,
				//fillSpace: true
			});
			
			// jquery:slider
			j("#interval_animation").slider({
				min: 0.5,
				max: 10,
				step: 0.5,
				value: 4
			});

			// jquery:tooltip
			// http://www.alessioatzeni.com/blog/simple-tooltip-with-jquery-only-text/
			// Tooltip only Text
			j('.masterTooltip').hover(function(){
					// Hover over code
					var title = j('#interval_animation').attr('title');
					j('#interval_animation').data('tipText', title).removeAttr('title');
					j('<p class="tooltip"></p>')
					.text(title)
					.appendTo('body')
					.fadeIn('slow');
			}, function() {
					// Hover out code
					j('#interval_animation').attr('title', j('#interval_animation').data('tipText'));
					j('.tooltip').remove();
			}).mousemove(function(e) {
					var mousex = e.pageX + 20; //Get X coordinates
					var mousey = e.pageY + 10; //Get Y coordinates
					j('.tooltip')
					.css({ top: mousey, left: mousex })
			});
        },
      

        /* Constructor */

        this.initialize();

    } // function PresView

})( jQuery );


