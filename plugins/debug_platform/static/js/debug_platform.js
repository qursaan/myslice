/**
 * Description: DebugPlatform plugin
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */

(function($){

    
    // routing calls
    jQuery.fn.DebugPlatform = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.DebugPlatform' );
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

            var default_code_mirror_options = {
              gutters: ["note-gutter", "CodeMirror-linenumbers"],
              tabSize: 4,
              indentUnit: 4,
              matchBrackets: true,
              lineNumbers: true,
              lineWrapping: true,
              tabMode: 'spaces' // or 'shift'
            };

            /* Default settings */
            var options = $.extend( {
                useCodeMirror: true,
                codeMirrorOptions: default_code_mirror_options,
                syntaxHighlighting: []
            }, options);

            return this.each(function() {

                var $this = $(this);

                /* An object that will hold private variables and methods */
                var plugin = new DebugPlatform(options);
                $this.data('Manifold', plugin);

                /* Events */
                $this.on('show.DebugPlatform', methods.show);

                // This is the new plugin API meant to replace the weird publish_subscribe mechanism
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
                var hazelnut = $this.data('Manifold');

                // Unbind all events using namespacing
                $(window).unbind('Manifold');

                // Remove associated data
                hazelnut.remove();
                $this.removeData('Manifold');
            });
        }, // destroy

    }; // var methods;

    /***************************************************************************
     * Plugin object
     ***************************************************************************/

    function DebugPlatform(options)
    {
        /* member variables */
        this.options = options;

        var object = this;

    } // function DebugPlatform

})( jQuery );

