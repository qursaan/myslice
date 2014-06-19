/**
 * MyPlugin:    demonstration plugin
 * Version:     0.1
 * Description: Template for writing new plugins and illustrating the different
 *              possibilities of the plugin API.
 *              This file is part of the Manifold project 
 * Requires:    js/plugin.js
 * URL:         http://www.myslice.info
 * Author:      Jordan Augé <jordan.auge@lip6.fr>
 * Copyright:   Copyright 2012-2013 UPMC Sorbonne Universités
 * License:     GPLv3
 */

(function($){

    var SlaDialog = Plugin.extend({

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element) {
	    // for debugging tools
	    this.classname="SlaDialog";
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            /* Member variables */

            /* Plugin events */

            /* Setup query and record handlers */

            // Explain this will allow query events to be handled
            // What happens when we don't define some events ?
            // Some can be less efficient
            this.listen_query(options.query_uuid);
            
            /* GUI setup and event binding */
            // call function

        },

        find_row: function(key)
        {
            // key in third position, column id = 2
            var KEY_POS = 2;

            var cols = $.grep(this.table.fnSettings().aoData, function(col) {
                return (col._aData[KEY_POS] == key);
            } );

            if (cols.length == 0)
                return null;
            if (cols.length > 1)
                throw "Too many same-key rows in ResourceSelected plugin";

            return cols[0];
        },

        /* PLUGIN EVENTS */
        // on_show like in querytable


        /* GUI EVENTS */

        uncheck: function(urn)
        {
            $('#slamodal').on('hidden.bs.modal', function(e){
                $('#' + (urn).replace(/"/g,'')).click();
                console.log('#' + (data.value).replace(/"/g,''));
            });
        },

        // a function to bind events here: click change
        // how to raise manifold events
        set_state: function(data, username)
        {
            
        },

        post_agreement: function()
        {
            console.log(this.options.user);
        },

        /* GUI MANIPULATION */

        // We advise you to write function to change behaviour of the GUI
        // Will use naming helpers to access content _inside_ the plugin
        // always refer to these functions in the remaining of the code

        show_hide_button: function() 
        {
            // this.id, this.el, this.cl, this.elts
            // same output as a jquery selector with some guarantees
        },

        /* TEMPLATES */

        // see in the html template
        // How to load a template, use of mustache

        /* QUERY HANDLERS */

        // How to make sure the plugin is not desynchronized
        // He should manifest its interest in filters, fields or records
        // functions triggered only if the proper listen is done

        // no prefix

        on_filter_added: function(filter)
        {

        },

        on_field_state_changed: function(result)
        {
            console.log("triggered state_changed: "+result);
            // this.set_state(result, this.options.username);
        }, 

        // ... be sure to list all events here

        /* RECORD HANDLERS */
        on_all_new_record: function(record)
        {
            //
        },

        on_new_record: function(record)
        {

        },

        /* INTERNAL FUNCTIONS */
        _dummy: function() {
            // only convention, not strictly enforced at the moment
        },

    });

    /* Plugin registration */
    $.plugin('SlaDialog', SlaDialog);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.

})(jQuery);
