/**
 * TestbedsPlugin: List of testbeds plugin
 * Version:     0.1
 * Description: TODO -> generalize to a list of possible filters
 *              This file is part of the Manifold project 
 * Requires:    js/plugin.js
 * URL:         http://www.myslice.info
 * Author:      Loïc Baron <loic.baron@lip6.fr>
 * Copyright:   Copyright 2012-2013 UPMC Sorbonne Universités
 * License:     GPLv3
 */

(function($){

    var TestbedsPlugin = Plugin.extend({

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element) {
	        // for debugging tools
	        this.classname="testbedsplugin";
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            /* Member variables */
            this.filters = Array();

            /* Plugin events */

            /* Setup query and record handlers */

            // Explain this will allow query events to be handled
            // What happens when we don't define some events ?
            // Some can be less efficient
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_all_uuid, 'all');
            this.listen_query(options.query_network_uuid, 'network');

            /* GUI setup and event binding */
            // call function

        },

        /* PLUGIN EVENTS */
        // on_show like in querytable


        /* GUI EVENTS */

        // a function to bind events here: click change
        // how to raise manifold events


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

        /* When a filter is added/removed, update the list of filters local to the plugin */
        on_filter_added: function(filter)
        {
            this.filters.push(filter);
            if(filter[0]=='network_hrn'){
                if(filter[1]=='included'){
                    $.each(filter[2], function(value){
                        $("#testbeds-filter_"+value).addClass("active");
                    });
                }else if(filter[1]=='=' || filter[1]=='=='){
                    $("#testbeds-filter_"+filter[2]).addClass("active");
                }
            }
        },
        on_filter_removed: function(filter)
        {
            this.filters = $.grep(this.filters, function(x) {
                return x == filter;
            });
            if(filter[0]=='network_hrn'){
                if(filter[1]=='included'){
                    $.each(filter[2], function(value){
                        $("#testbeds-filter_"+value).removeClass("active");
                    });
                }else if(filter[1]=='=' || filter[1]=='=='){
                    $("#testbeds-filter_"+filter[2]).removeClass("active");
                }
            }
        },

        // ... be sure to list all events here

        /* RECORD HANDLERS */
        on_network_new_record: function(record)
        {
            row  = '<a href="#" class="list-group-item sl-platform" id="testbeds-filter_'+record["network_hrn"]+'" data-platform="'+record["network_hrn"]+'">';
            row += '<span class="list-group-item-heading">'+record["platform"]+'</span>';
            //row += '<span class="list-group-item-heading">'+record["network_hrn"]+'</span></a>';
            row += '<p class="list-group-item-text">'+record["network_hrn"]+'</p></a>';
            $('#testbeds-filter').append(row);
        },

        /* When the network query is done, add the click event to the elements  */
        on_network_query_done: function() {
            var self = this;
            console.log('query network DONE');
            $("[id^='testbeds-filter_']").on('click',function(e) {
                $(this).toggleClass("active");

                // avoid multiple calls when an event is raised to manifold.js
                e.stopPropagation();

                value = this.dataset['platform'];
                // handle the hrn that include . in their name (has to be in sync with the data from SFA)
                //value = value.replace(/\./g,"\\.");
                key = "network_hrn";
                op = "included";
                return $(this).hasClass('active') ? self._addFilter(key, op, value) : self._removeFilter(key, op, value);
            });
           
        },

        /* INTERNAL FUNCTIONS */
        _dummy: function() {
            // only convention, not strictly enforced at the moment
        },
        _addFilter: function(key, op, value)
        {
            console.log("add "+value);
            var self = this;
            values = Array();
            // get the previous list of values for this key, ex: [ple,nitos]
            // remove the previous filter
            network_filter = $.grep(this.filters, function(x) {
                return x[0] == "network_hrn";
            });
            if(network_filter.length > 0){
                $.each(network_filter, function(i,f){
                    values = f[2];
                    manifold.raise_event(self.options.query_uuid, FILTER_REMOVED, [key, op, values]);
                });
            }
            // Add the new value to list of values, ex: wilab
            values.push(value);
            
            // Update the filter with the new list of values, ex: [ple,nitos,wilab]
            manifold.raise_event(this.options.query_uuid, FILTER_ADDED, [key, op, values]);
        },
        _removeFilter: function(key, op, value)
        {
            console.log("remove "+value);
            var self = this;
            values = Array();
            // get the previous list of values for this key, ex: [ple,nitos,wilab]
            // remove the previous filter
            network_filter = $.grep(this.filters, function(x) {
                return x[0] == "network_hrn";
            });
            if(network_filter.length > 0){
                $.each(network_filter, function(i,f){
                    values = f[2];
                    manifold.raise_event(self.options.query_uuid, FILTER_REMOVED, [key, op, values]);
                });
            }

            // remove the value from the list of values, ex: wilab
            values = $.grep(values, function(x) {
                return x != value;
            });
            if(values.length>0){
                // Update the filter with the new list of values, ex: [ple,nitos]
                manifold.raise_event(this.options.query_uuid, FILTER_ADDED, [key, op, values]);
            }
        }

    });

    /* Plugin registration */
    $.plugin('TestbedsPlugin', TestbedsPlugin);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.

})(jQuery);
