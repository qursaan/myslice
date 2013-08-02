/**
 * MySlice MyPlugin demonstration plugin
 * Version: 0.1.0
 * URL: http://www.myslice.info
 * Description: Template for writing new plugins and illustrating the different possibilities of the plugin API
 * Requires: 
 * Author: The MySlice Team
 * Copyright: Copyright 2012-2013 UPMC Sorbonne Universités
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */
(function( $ ){

    var PLUGIN_NAME = 'MyPlugin';

    // Routing calls
    jQuery.fn.ResourcesSelected = function( method ) {
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            jQuery.error( 'Method ' +  method + ' does not exist on jQuery' + PLUGIN_NAME );
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
        init : function( options ) {

            return this.each(function(){

                var $this = $(this);

                /* An object that will hold private variables and methods */
                var s = new ResourcesSelected(options);
                $(this).data('Manifold', s);
                
            }); // this.each
        }, // init

        /**
         * @brief Plugin destruction
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        destroy : function( ) {

            return this.each(function(){
                var $this = jQuery(this), data = $this.data('Manifold');
                jQuery(window).unbind('Manifold');
                data.Manifold.remove();
                $this.removeData('Manifold');
            })

        }, // destroy

    }; // var methods

    /***************************************************************************
     * ResourcesSelected object
     ***************************************************************************/

    function MyPlugin(options)
    {
        /* member variables */

        this.options = options;

        /* methods */

        /* constructor */

    } // function MyPlugin

})(jQuery);
