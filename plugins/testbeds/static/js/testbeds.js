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

        $scope.facility_names = Array();
        $scope.testbed_names = new Object();

        /* Models */
        //$scope.testbeds = Array();
        $scope._facility_active = new Object();
        $scope._testbed_active  = new Object();

        $scope.is_facility_active = function(facility)
        {
            return (($scope._facility_active[facility] === undefined) || $scope._facility_active[facility]);
        };

        $scope.is_testbed_active = function(facility, testbed)
        {
            return (($scope._testbed_active[facility] === undefined) || 
                    ($scope._testbed_active[facility][testbed] === undefined) || 
                    ($scope._testbed_active[facility][testbed]));
        };

        $scope.set_facility_active = function(facility, value)
        {
            $scope._facility_active[facility] = value;
        };

        $scope.set_testbed_active = function(facility, testbed, value)
        {
            if ($scope._testbed_active[facility] === undefined)
                $scope._testbed_active[facility] = new Object();
            $scope._testbed_active[facility][testbed] = value;
        };
        
        $scope.tolower = function(string) {
            return string.toLowerCase(string);  
        };
    
        /* Click event */

        $scope.select_facility = function(facility)
        {
            var selected, prev_selected, num, num_selected, num_prev_selected, filter;

            // prev_selected = $.map($scope.facility_names, function(x, i) {
                // return $scope.is_facility_active(x) ? x : null;
            // });

            $scope.set_facility_active(facility, ! $scope.is_facility_active(facility));
            
            $.each($scope.testbed_names[facility], function(j, testbed_name) {
                $scope.select_testbed(facility, testbed_name);
            });
            console.log($scope);
            // selected = $.map($scope.facility_names, function(x, i) {
                // return $scope.is_facility_active(x) ? x : null;
            // });

            // num = $scope.facility_names.length;
            // prev_num_selected = prev_selected.length;
            // num_selected = selected.length;

            // if ((prev_num_selected != 0) && (prev_num_selected != num)) {
                // // Remove previous filter
                // filter = ['facility_name', 'included', prev_selected];
                // manifold.raise_event($scope.instance.options.query_uuid, FILTER_REMOVED, filter);
            // }
// 
            // if (num_selected != num) {
                // filter = ['facility_name', 'included', selected];
                // manifold.raise_event($scope.instance.options.query_uuid, FILTER_ADDED, filter);
            // }
        };

        $scope.select_testbed = function(facility, testbed)
        {
            var selected, prev_selected, num, num_selected, num_prev_selected, filter;

            prev_selected = Array();
            $.each($scope.facility_names, function(i, facility_name) {
                $.each($scope.testbed_names[facility_name], function(j, testbed_name) {
                    if ($scope.is_testbed_active(facility_name, testbed_name)) {
                        // XXX We should have a joint facility/testbed filter
                        prev_selected.push(testbed_name);
                    }
                });

            });

            $scope.set_testbed_active(facility, testbed, ! $scope.is_testbed_active(facility, testbed));

            selected = Array();
            $.each($scope.facility_names, function(i, facility_name) {
                $.each($scope.testbed_names[facility_name], function(j, testbed_name) {
                    if ($scope.is_testbed_active(facility_name, testbed_name)) {
                        // XXX We should have a joint facility/testbed filter
                        selected.push(testbed_name);
                    }
                });

            });

            num = 0;
            $.each($scope.facility_names, function(i, facility_name) {
                num += $scope.testbed_names[facility_name].length;
            });
            prev_num_selected = prev_selected.length;
            num_selected = selected.length;

            if ((prev_num_selected != 0) && (prev_num_selected != num)) {
                // Remove previous filter
                // XXX We should have a joint facility/testbed filter
                filter = ['testbed_name', 'included', prev_selected];
                manifold.raise_event($scope.instance.options.query_uuid, FILTER_REMOVED, filter);
            }

            if (num_selected != num) {
                // XXX We should have a joint facility/testbed filter
                filter = ['testbed_name', 'included', selected];
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
            this.testbeds = Array();

            this._get_scope().instance = this;

            /* Handlers */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_networks_uuid, 'networks');
        },


        /* HANDLERS */

        /* When a filter is added/removed, update the list of filters local to the plugin */
        /*
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
        */
        // ... be sure to list all events here

        on_query_done: function()
        {
            var scope, query_ext, resources;
            scope = this._get_scope();
            query_ext = manifold.query_store.find_analyzed_query_ext(this.options.query_uuid);
            resources = query_ext.records.values();

            $.each(resources, function(i, resource) {
                if ($.inArray(resource.facility_name, scope.facility_names) == -1)
                    scope.facility_names.push(resource.facility_name);
                if (scope.testbed_names[resource.facility_name] === undefined)
                    scope.testbed_names[resource.facility_name] = Array();
                if ($.inArray(resource.testbed_name, scope.testbed_names[resource.facility_name]) == -1)
                    scope.testbed_names[resource.facility_name].push(resource.testbed_name);
            });

            scope.$apply();
        },

        /*
        on_networks_query_done: function()
        {
            var scope = this._get_scope();
            var query_ext = manifold.query_store.find_analyzed_query_ext(this.options.query_networks_uuid);
            scope.testbeds = query_ext.records.values();
            $.each(scope.testbeds, function(i, testbed) { testbed.active = true });
            scope.$apply();
        },
*/

        /* INTERNAL FUNCTIONS */

        _get_scope : function()
        {
            return angular.element('[ng-controller=TestbedsCtrl]').scope();
        },

/*
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
*/
    });

    /* Plugin registration */
    $.plugin('TestbedsPlugin', TestbedsPlugin);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.

})(jQuery);
