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

// XXX Inherit from an AngularPlugin class ?
(function (ng, app) {

    // Define our Controller constructor.
    function Controller($scope) {
        /* Contructor */

        /* Plugin instance */
        $scope.instance = null;

        /* Models */
        $scope.testbeds = Array();

        /* Click event */
        $scope.select = function(testbed)
        {
            var selected, prev_selected, num, num_selected, num_prev_selected, filter;

            prev_selected = $.map($scope.testbeds, function(x, i) {
                return x.active ? x.network_hrn : null;
            });

            testbed.active = !testbed.active;

            selected = $.map($scope.testbeds, function(x, i) {
                return x.active ? x.network_hrn : null;
            });

            num = $scope.testbeds.length;
            prev_num_selected = prev_selected.length;
            num_selected = selected.length;

            
            if ((prev_num_selected != 0) && (prev_num_selected != num)) {
                // Remove previous filter
                filter = ['network_hrn', 'included', prev_selected];
                manifold.raise_event($scope.instance.options.query_uuid, FILTER_REMOVED, filter);
            }

            if ((num_selected != 0) && (num_selected != num)) {
                filter = ['network_hrn', 'included', selected];
                manifold.raise_event($scope.instance.options.query_uuid, FILTER_ADDED, filter);
            }
        };

        /* Return object reference */
        return (this);
    }

    // Define the Controller as the constructor function.
    app.controller("TestbedsCtrl", Controller);

})(angular, ManifoldApp);

(function($){
    var TestbedsPlugin = Plugin.extend({

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function(options, element) 
        {
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            /* Member variables */
            this.filters = Array();
            this.testbeds = Array();

            this._get_scope().instance = this;

            /* Handlers */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_networks_uuid, 'networks');
        },


        /* HANDLERS */

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
                // XXX NAMING
                // XXX How to display unsupported filters
                // XXX Constants for operators
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

        on_networks_query_done: function()
        {
             this.set_networks();
        },

/*
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
           
        },*/

        /* INTERNAL FUNCTIONS */

        set_networks: function()
        {
            var scope = this._get_scope();
            var query_ext = manifold.query_store.find_analyzed_query_ext(this.options.query_networks_uuid);
            scope.testbeds = query_ext.records.values();
            $.each(scope.testbeds, function(i, testbed) { testbed.active = true });
            scope.$apply();
        },

        _get_scope : function()
        {
            return angular.element('[ng-controller=TestbedsCtrl]').scope()
        },

        _addFilter: function(key, op, value)
        {
            values = Array();
            // get the previous list of values for this key, ex: [ple,nitos]
            // remove the previous filter
            network_filter = $.grep(this.filters, function(x) {
                return x[0] == "network_hrn";
            });
            if(network_filter.length > 0){
                $.each(network_filter, function(i,f){
                    values = f[2];
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
