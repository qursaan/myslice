/**
 * Description: implements a form
 * Copyright (c) 2013 UPMC Sorbonne Universite
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */
(function($){

    /***************************************************************************
     * Method calling logic
     ***************************************************************************/

    $.fn.CreateForm = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            return undefined;
            //$.error( 'Method ' +  method + ' does not exist on jQuery.CreateForm' );
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
                var form = new CreateForm(options);
                $this.data('plugin', form);

            }); // this.each
        }, // init

    };

    /***************************************************************************
     * CreateForm object
     ***************************************************************************/

    function CreateForm(options) {

        /* save a reference to this */
        var $this = this;
        var $obj  = $('#' + options.plugin_uuid);

        /* member variables */
        this.options = options;

        /* methods */

        this.on_result = function(data) {

        }
        
        /**
         * \brief Validate the form
         * \param validate_callback (function) a callback to be triggered when validation is done
         * \return True if all fields match validation regex
         */
        this.validate = function(validate_callback) {
            var frm = document.forms['form_'+options.plugin_uuid]

            // $this = $('#' + options.plugin_uuid); // useless

            // Loop on the fields and test regexp if present
            var err = false;
            var params = {}
            $.each(options.columns, function(i, column) {
                var value = frm.elements[column['field']].value;
                var rx    = column['validate_rx'];
                var str   = '';
                if (rx && !value.match(rx)) {
                    str = column['validate_err'];
                    err = true;
                }
                params[column['field']] = value;
                $('#err-' + options.plugin_uuid + '-' + column['field']).html(str);
            });

            /* If the form correctly validates, we issue a create query */
            if (!err) {
                var query = {
                    'action': 'create',
                    'object': 'local:user',
                    'params': params,
                };

                /* Inform user about ongoing query: spinner */
                this.disable();
                manifold.spin($obj);

                /* Issue json query and wait for callback */
                manifold.forward(query, this.onresult);
            }

            /* Note, if the create has already been done (or fails, or ... ?)
             * shall we proceed to an update ? */

            /* We always return false. Only the query callback is in charge of
             * advancing to next step */
            return false;
        }

        /**
         * \brief Disable the form entirely, during a create query for example
         */
        this.disable = function() {

        }

    }

})( jQuery );
