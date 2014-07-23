/*
#
# Copyright (c) 2013 NITLab, University of Thessaly, CERTH, Greece
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.
#
#
# This is a MySlice plugin for the NITOS Scheduler
# Nitos Scheduler v1
#
*/

// XXX groupid = all slots those that go with a min granularity

/* some params */
var scheduler2;
var scheduler2Instance;
//is ctrl keyboard button pressed
var schedulerCtrlPressed = false;
//table Id
var schedulerTblId = "scheduler-reservation-table";
var SCHEDULER_FIRST_COLWIDTH = 200;


/* Number of scheduler slots per hour. Used to define granularity. Should be inferred from resources XXX */
var schedulerSlotsPerHour = 6;
var RESOURCE_DEFAULT_GRANULARITY    = 1800 /* s */; // should be computed automatically from resource information
var DEFAULT_GRANULARITY             = 1800 /* s */; // should be computed automatically from resource information. Test with 600
var DEFAULT_PAGE_RANGE = 5;

var schedulerMaxRows = 12;

/* All resources */
var SchedulerData = [];

/* ??? */
var SchedulerSlots = [];

var SchedulerDateSelected = new Date();
// Round to midnight
SchedulerDateSelected.setHours(0,0,0,0);

/* Filtered resources */
var SchedulerDataViewData = [];

var SchedulerSlotsViewData = [];
//Help Variables
var _schedulerCurrentCellPosition = 0;
//Enable Debug
var schedulerDebug = true;
//tmp to delete
var tmpSchedulerLeases = [];

var SCHEDULER_COLWIDTH = 50;


/******************************************************************************
 *                             ANGULAR CONTROLLER                             *
 ******************************************************************************/

// Create a private execution space for our controller. When
// executing this function expression, we're going to pass in
// the Angular reference and our application module.
(function (ng, app) {

    // Define our Controller constructor.
    function Controller($scope) {

        // Store the scope so we can reference it in our
        // class methods
        this.scope = $scope;

        // Set up the default scope value.
        this.scope.errorMessage = null;
        this.scope.name = "";

        //Pagin
        $scope.current_page = 1;
        this.scope.items_per_page = 10;
        $scope.from = 0; // JORDAN

        $scope.instance = null;
        $scope.resources = new Array();
        $scope.slots = SchedulerSlotsViewData;
        $scope.granularity = DEFAULT_GRANULARITY; /* Will be setup */
        //$scope.msg = "hello";

        angular.element(document).ready(function() {
            //console.log('Hello World');
            //alert('Hello World');
            //afterAngularRendered();
        });

        // Pagination

        $scope.range = function() {
            var range_size = $scope.page_count() > DEFAULT_PAGE_RANGE ? DEFAULT_PAGE_RANGE : $scope.page_count();
            var ret = [];
            var start;

            start = $scope.current_page;
            if ( start > $scope.page_count()-range_size ) {
              start = $scope.page_count()-range_size+1;
            }

            for (var i=start; i<start+range_size; i++) {
              ret.push(i);
            }
            return ret;
        };

        $scope.prevPage = function() {
          if ($scope.current_page > 1) {
            $scope.current_page--;
          }
        };

        $scope.prevPageDisabled = function() {
          return $scope.current_page === 1 ? "disabled" : "";
        };
  
        $scope.page_count = function()
        {
            // XXX need visible resources only
            var query_ext, visible_resources_length;
            if (!$scope.instance)
                return 0;
            query_ext = manifold.query_store.find_analyzed_query_ext($scope.instance.options.query_uuid);
            var visible_resources_length = 0;
            query_ext.state.each(function(i, state) {
                if (state[STATE_VISIBLE])
                    visible_resources_length++;
            });
            return Math.ceil(visible_resources_length/$scope.items_per_page);
        };
  
        $scope.nextPage = function() {
          if ($scope.current_page < $scope.page_count()) {
            $scope.current_page++;
          }
        };
  
        $scope.nextPageDisabled = function() {
          return $scope.current_page === $scope.page_count() ? "disabled" : "";
        }; 

        $scope.setPage = function(n) {
            $scope.current_page = n;
        };
        // END pagination

        // FILTER

        $scope.filter_visible = function(resource)
        {
            return manifold.query_store.get_record_state($scope.instance.options.query_uuid, resource['urn'], STATE_VISIBLE);
        };

        // SELECTION

        $scope._create_new_lease = function(resource_urn, start_time, end_time)
        {
            var lease_key, new_lease, data;

            lease_key = manifold.metadata.get_key('lease');

            new_lease = {
                resource:   resource_urn,
                start_time: start_time,
                end_time:   end_time,
            };

            // This is needed to create a hashable object
            new_lease.hashCode = manifold.record_hashcode(lease_key.sort());
            new_lease.equals   = manifold.record_equals(lease_key);

            data = {
                state: STATE_SET,
                key  : null,
                op   : STATE_SET_ADD,
                value: new_lease
            }
            manifold.raise_event($scope.instance.options.query_lease_uuid, FIELD_STATE_CHANGED, data);
            /* Add to local cache also, unless we listen to events from outside */
            if (!(resource_urn in $scope._leases_by_resource))
                $scope._leases_by_resource[resource_urn] = [];
            $scope._leases_by_resource[resource_urn].push(new_lease);
        }

        $scope._remove_lease = function(other)
        {
            var lease_key, other_key, data;

            lease_key = manifold.metadata.get_key('lease');

            // XXX This could be a manifold.record_get_value
            other_key = {
                resource:   other.resource,
                start_time: other.start_time,
                end_time:   other.end_time
            }
            other_key.hashCode = manifold.record_hashcode(lease_key.sort());
            other_key.equals   = manifold.record_equals(lease_key);

            data = {
                state: STATE_SET,
                key  : null,
                op   : STATE_SET_REMOVE,
                value: other_key
            }
            manifold.raise_event($scope.instance.options.query_lease_uuid, FIELD_STATE_CHANGED, data);
            /* Remove from local cache also, unless we listen to events from outside */
            $scope._leases_by_resource[other.resource] = $.grep($scope._leases_by_resource[other.resource], function(x) { return x != other; });

        }

        $scope.select = function(index, model_lease, model_resource)
        {
            var data, resource_granularity;

            //resource_granularity = model_resource.granularity === undefined ? RESOURCE_DEFAULT_GRANULARITY : model_resource.granularity;

            console.log("Selected", index, model_lease, model_resource);

            var day_timestamp = SchedulerDateSelected.getTime() / 1000;
            var start_time = day_timestamp + index       * model_resource.granularity; // XXX resource_granularity
            var end_time   = day_timestamp + (index + 1) * model_resource.granularity; //
            var start_date = new Date(start_time * 1000);
            var end_date   = new Date(end_time   * 1000);

            var lease_key = manifold.metadata.get_key('lease');

            // We search for leases in the cache we previously constructed
            var resource_leases = $scope._leases_by_resource[model_resource.urn];

            switch (model_lease.status)
            {
                case 'free': // out
                case 'pendingout':
                    if (resource_leases) {
                        /* Search for leases before */
                        $.each(resource_leases, function(i, other) {
                            if (other.end_time != start_time)
                                return true; // ~ continue
        
                            /* The lease 'other' is just before, and there should not exist
                             * any other lease before it */
                            start_time = other.start_time;
        
                            other_key = {
                                resource:   other.resource,
                                start_time: other.start_time,
                                end_time:   other.end_time
                            }
                            // This is needed to create a hashable object
                            other_key.hashCode = manifold.record_hashcode(lease_key.sort());
                            other_key.equals   = manifold.record_equals(lease_key);
        
                            data = {
                                state: STATE_SET,
                                key  : null,
                                op   : STATE_SET_REMOVE,
                                value: other_key
                            }
                            manifold.raise_event($scope.instance.options.query_lease_uuid, FIELD_STATE_CHANGED, data);
                            /* Remove from local cache also, unless we listen to events from outside */
                            $scope._leases_by_resource[model_resource.urn] = $.grep($scope._leases_by_resource[model_resource.urn], function(x) { return x != other; });
                            return false; // ~ break
                        });
        
                        /* Search for leases after */
                        $.each(resource_leases, function(i, other) {
                            if (other.start_time != end_time)
                                return true; // ~ continue
        
                            /* The lease 'other' is just after, and there should not exist
                             * any other lease after it */
                            end_time = other.end_time;
                            other_key = {
                                resource:   other.resource,
                                start_time: other.start_time,
                                end_time:   other.end_time
                            }
                            // This is needed to create a hashable object
                            other_key.hashCode = manifold.record_hashcode(lease_key.sort());
                            other_key.equals   = manifold.record_equals(lease_key);
        
                            data = {
                                state: STATE_SET,
                                key  : null,
                                op   : STATE_SET_REMOVE,
                                value: other_key
                            }
                            manifold.raise_event($scope.instance.options.query_lease_uuid, FIELD_STATE_CHANGED, data);
                            /* Remove from local cache also, unless we listen to events from outside */
                            $scope._leases_by_resource[model_resource.urn] = $.grep($scope._leases_by_resource[model_resource.urn], function(x) { return x != other; });
                            return false; // ~ break
                        });
                    }
        
                    $scope._create_new_lease(model_resource.urn, start_time, end_time);
                    model_lease.status = (model_lease.status == 'free') ? 'pendingin' : 'selected';
                    // unless the exact same lease already existed (pending_out status for the lease, not the cell !!)

                    break;

                case 'selected':
                case 'pendingin':
                    // We remove the cell

                    /* We search for leases including this cell. Either 0, 1 or 2.
                     * 0 : NOT POSSIBLE, should be checked.
                     * 1 : either IN or OUT, we have make no change in the session
                     * 2 : both will be pending, since we have made a change in the session
                    * /!\ need to properly remove pending_in leases when removed again
                     */
                    if (resource_leases) {
                        $.each(resource_leases, function(i, other) {
                            if ((other.start_time <= start_time) && (other.end_time >= end_time)) {
                                // The cell is part of this lease.

                                // If the cell is not at the beginning of the lease, we recreate a lease with cells before
                                if (start_time > other.start_time) {
                                    $scope._create_new_lease(model_resource.urn, other.start_time, start_time);
                                }

                                // If the cell is not at the end of the lease, we recreate a lease with cells after
                                if (end_time < other.end_time) {
                                    $scope._create_new_lease(model_resource.urn, end_time, other.end_time);
                                }
                                
                                // The other lease will be removed
                                $scope._remove_lease(other);
                            }
                            // NOTE: We can interrupt the search if we know that there is a single lease (depending on the status).
                        });
                    }
                
                    // cf comment in previous switch case
                    model_lease.status = (model_lease.status == 'selected') ? 'pendingout' : 'free';

                    break;

                case 'reserved':
                case 'maintainance':
                    // Do nothing
                    break;
            }
            

            $scope._dump_leases();
        };
  
        $scope._dump_leases = function()
        {
            // DEBUG: display all leases and their status in the log
            var leases = manifold.query_store.get_records($scope.instance.options.query_lease_uuid);
            console.log("--------------------");
            $.each(leases, function(i, lease) {
                var key = manifold.metadata.get_key('lease');
                var lease_key = manifold.record_get_value(lease, key);
                var state = manifold.query_store.get_record_state($scope.instance.options.query_lease_uuid, lease_key, STATE_SET);
                var state_str;
                switch(state) {
                    case STATE_SET_IN:
                        state_str = 'STATE_SET_IN';
                        break;
                    case STATE_SET_OUT:
                        state_str = 'STATE_SET_OUT';
                        break;
                    case STATE_SET_IN_PENDING:
                        state_str = 'STATE_SET_IN_PENDING';
                        break;
                    case STATE_SET_OUT_PENDING:
                        state_str = 'STATE_SET_OUT_PENDING';
                        break;
                    case STATE_SET_IN_SUCCESS:
                        state_str = 'STATE_SET_IN_SUCCESS';
                        break;
                    case STATE_SET_OUT_SUCCESS:
                        state_str = 'STATE_SET_OUT_SUCCESS';
                        break;
                    case STATE_SET_IN_FAILURE:
                        state_str = 'STATE_SET_IN_FAILURE';
                        break;
                    case STATE_SET_OUT_FAILURE:
                        state_str = 'STATE_SET_OUT_FAILURE';
                        break;
                }
                console.log("LEASE", new Date(lease.start_time * 1000), new Date(lease.end_time * 1000), lease.resource, state_str);
            });
        };

        // Return this object reference.
        return (this);

    }

    // Define the Controller as the constructor function.
    app.controller("SchedulerCtrl", Controller);

})(angular, ManifoldApp);

/******************************************************************************
 *                              MANIFOLD PLUGIN                               *
 ******************************************************************************/

(function($) {
        scheduler2 = Plugin.extend({

            /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
            init: function(options, element) {
                // Call the parent constructor, see FAQ when forgotten
                this._super(options, element);

                var scope = this._get_scope()
                scope.instance = this;

                // XXX not needed
                scheduler2Instance = this;

                // We need to remember the active filter for datatables filtering
                // XXX not needed
                this.filters = Array();

                // XXX BETTER !!!!
                $(window).delegate('*', 'keypress', function (evt){
                        alert("erm");
                      });

                $(window).keydown(function(evt) {
                    if (evt.which == 17) { // ctrl
                        schedulerCtrlPressed = true;
                    }
                }).keyup(function(evt) {
                    if (evt.which == 17) { // ctrl
                        schedulerCtrlPressed = false;
                    }
                });

                // XXX naming
                //$("#" + schedulerTblId).on('mousedown', 'td', rangeMouseDown).on('mouseup', 'td', rangeMouseUp).on('mousemove', 'td', rangeMouseMove);

                this._resources_received = false;
                this._leases_received = false;
                
                scope._leases_by_resource = {};

                /* Listening to queries */
                this.listen_query(options.query_uuid, 'resources');
                this.listen_query(options.query_lease_uuid, 'leases');

                this.elmt().on('show', this, this.on_show);
                this.elmt().on('shown.bs.tab', this, this.on_show);
                this.elmt().on('resize', this, this.on_resize);

                /* Generate slots according to the default granularity. Should
                 * be updated when resources arrive.  Should be the pgcd in fact XXX */
                this._granularity = DEFAULT_GRANULARITY;
                scope.granularity = this._granularity;
                this.scope_resources_by_key = {};

                this.do_resize();
    
                scope.from = 0;

                this._initUI();

            },

            do_resize: function()
            {
                var scope = this._get_scope();
                var num_hidden_cells, new_max, lcm;

                // do_resize has to be called when the window is resized, or one parameter changes
                // e.g. when new resources have been received
                //
                this.resource_granularities = [3600, 1800]; //, 2400]; /* s */

                /* Compute the slot length to accommodate all resources. This
                 * is the GCD of all resource granularities. */
                this._slot_length = this._gcdn(this.resource_granularities);

                $('#' + schedulerTblId + ' thead tr th:eq(0)').css("width", SCHEDULER_FIRST_COLWIDTH);
                //self get width might need fix depending on the template 
                var tblwidth = $('#scheduler-reservation-table').parent().outerWidth();

                /* Number of visible cells...*/
                this._num_visible_cells = parseInt((tblwidth - SCHEDULER_FIRST_COLWIDTH) / SCHEDULER_COLWIDTH);

                /* ...should be a multiple of the lcm of all encountered granularities. */
                lcm = this._lcmn(this.resource_granularities) / this._slot_length;
                this._num_visible_cells = this._num_visible_cells - this._num_visible_cells % lcm;

                // A list of {id, time} dictionaries representing the slots for the given day
                this._all_slots = this._generate_all_slots();

                /* scope also needs this value */
                scope.slots = this._all_slots;
                scope.slot_length = this._slot_length;
                scope.num_visible_cells = this._num_visible_cells;
                scope.lcm_colspan = this._lcmn(this.resource_granularities); // XXX WHY ?

                /* Redraw... */
                this._scope_clear_leases();
                this._set_all_lease_slots();

                // Slider max value
                if ($('#tblSlider').data('slider') != undefined) {
                    num_hidden_cells = this._all_slots.length - this._num_visible_cells;

                    $('#tblSlider').slider('setAttribute', 'max', num_hidden_cells);
                    $('#tblSlider').slider('setValue', scope.from, true);
                }
                this._get_scope().$apply();


            },

            on_show: function(e)
            {
                var self = e.data;
                self.do_resize();
                self._get_scope().$apply();
            },

            on_resize: function(e)
            {
                var self = e.data;
                self.do_resize();
                self._get_scope().$apply();
            },

            /* Handlers */

            _get_scope : function()
            {
                return angular.element(document.getElementById('SchedulerCtrl')).scope();
            },
            
            _scope_set_resources : function()
            {
                var self = this;
                var scope = this._get_scope();

                var records = manifold.query_store.get_records(this.options.query_uuid);

                scope.resources = [];

                $.each(records, function(i, record) {
                    if (!record.exclusive)
                        return true; // ~ continue

                    // copy not to modify original record
                    var resource = jQuery.extend(true, {}, record);

                    // Fix granularity
                    //resource_granularity = ((resource.granularity === undefined) || (typeof(resource.granularity) != "number")) ? RESOURCE_DEFAULT_GRANULARITY : resource.granularity;
                    if (typeof(resource.granularity) != "number")
                        resource.granularity = RESOURCE_DEFAULT_GRANULARITY;
                    resource.leases = []; // a list of occupied timeslots

                    self.scope_resources_by_key[resource['urn']] = resource;
                    scope.resources.push(resource);
                });
            },

            _scope_clear_leases: function()
            {
                var time, now;
                var self = this;
                var scope = this._get_scope();

                now = new Date().getTime();

                // Setup leases with a default free status...
                $.each(this.scope_resources_by_key, function(resource_key, resource) {
                    resource.leases = [];
                    var colspan_lease = resource.granularity / self._slot_length; //eg. 3600 / 1800 => 2 cells
                    time = SchedulerDateSelected.getTime();
                    for (i=0; i < self._all_slots.length / colspan_lease; i++) { // divide by granularity
                        resource.leases.push({
                            id:     'coucou',
                            status: (time < now) ? 'disabled':  'free', // 'selected', 'reserved', 'maintenance' XXX pending ??
                        });
                        time += resource.granularity * 1000;
                    }
                });

            },

            _scope_set_leases: function()
            {
                    var status;
                var self = this;
                var scope = this._get_scope();
            
                manifold.query_store.iter_records(this.options.query_lease_uuid, function(lease_key, lease) {
                    console.log("SET LEASES", lease.resource, new Date(lease.start_time* 1000), new Date(lease.end_time* 1000));
                    // XXX We should ensure leases are correctly merged, otherwise our algorithm won't work

                    // Populate leases by resource array: this will help us merging leases later

                    // let's only put _our_ leases
                    lease_status = manifold.query_store.get_record_state(self.options.query_lease_uuid, lease_key, STATE_SET);
                    if (lease_status != STATE_SET_IN)
                        return true; // ~continue
                    if (!(lease.resource in scope._leases_by_resource))
                        scope._leases_by_resource[lease.resource] = [];
                    scope._leases_by_resource[lease.resource].push(lease);

                });

                this._set_all_lease_slots();
            },

            _set_all_lease_slots: function()
            {
                var self = this;
            
                manifold.query_store.iter_records(this.options.query_lease_uuid, function(lease_key, lease) {
                    self._set_lease_slots(lease_key, lease);
                });
            },

            on_resources_query_done: function(data)
            {
                this._resources_received = true;
                this._scope_set_resources();
                this._scope_clear_leases();
                if (this._leases_received)
                    this._scope_set_leases();
                    
                this._get_scope().$apply();
            },

            on_leases_query_done: function(data)
            {
                this._leases_received = true;
                if (this._resources_received) {
                    this._scope_set_leases();
                    this._get_scope().$apply();
                }
            },

            /* Filters on resources */
            on_resources_filter_added:   function(filter) { this._get_scope().$apply(); },
            on_resources_filter_removed: function(filter) { this._get_scope().$apply(); },
            on_resources_filter_clear:   function()       { this._get_scope().$apply(); },

            /* Filters on leases ? */
            on_leases_filter_added:      function(filter) { this._get_scope().$apply(); },
            on_leases_filter_removed:    function(filter) { this._get_scope().$apply(); },
            on_leases_filter_clear:      function()       { this._get_scope().$apply(); },

            on_field_state_changed: function(data)
            {
                /*
                this._set_lease_slots(lease_key, lease);

                switch(data.state) {
                    case STATE_SET:
                        switch(data.op) {
                            case STATE_SET_IN:
                            case STATE_SET_IN_SUCCESS:
                            case STATE_SET_OUT_FAILURE:
                                this.set_checkbox_from_data(data.value, true);
                                this.set_bgcolor(data.value, QUERYTABLE_BGCOLOR_RESET);
                                break;  
                            case STATE_SET_OUT:
                            case STATE_SET_OUT_SUCCESS:
                            case STATE_SET_IN_FAILURE:
                                this.set_checkbox_from_data(data.value, false);
                                this.set_bgcolor(data.value, QUERYTABLE_BGCOLOR_RESET);
                                break;
                            case STATE_SET_IN_PENDING:
                                this.set_checkbox_from_data(data.key, true);
                                this.set_bgcolor(data.value, QUERYTABLE_BGCOLOR_ADDED);
                                break;  
                            case STATE_SET_OUT_PENDING:
                                this.set_checkbox_from_data(data.key, false);
                                this.set_bgcolor(data.value, QUERYTABLE_BGCOLOR_REMOVED);
                                break;
                        }
                        break;

                    case STATE_WARNINGS:
                        this.change_status(data.key, data.value);
                        break;
                }
                */
            },


            /* INTERNAL FUNCTIONS */

            _set_lease_slots: function(lease_key, lease)
            {
                var resource, lease_status, lease_class;
                var day_timestamp, id_start, id_end, colspan_lease;

                resource = this.scope_resources_by_key[lease.resource];
                day_timestamp = SchedulerDateSelected.getTime() / 1000;
                id_start = Math.floor((lease.start_time - day_timestamp) / resource.granularity);

                /* Some leases might be in the past */
                if (id_start < 0)
                    id_start = 0;
                /* Leases in the future: ignore */
                if (id_start >= this._all_slots.length)
                    return true; // ~ continue

                id_end   = Math.ceil((lease.end_time   - day_timestamp) / resource.granularity);
                colspan_lease = resource.granularity / this._slot_length; //eg. 3600 / 1800 => 2 cells
                if (id_end >= this._all_slots.length / colspan_lease) {
                    /* Limit the display to the current day */
                    id_end = this._all_slots.length / colspan_lease
                }

                for (i = id_start; i < id_end; i++) {
                    // the same slots might be affected multiple times.
                    // PENDING_IN + PENDING_OUT => IN 
                    //
                    // RESERVED vs SELECTED !
                    //
                    // PENDING !!
                    lease_status = manifold.query_store.get_record_state(this.options.query_lease_uuid, lease_key, STATE_SET);
                    switch(lease_status) {
                        case STATE_SET_IN:
                            lease_class = 'selected'; // my leases
                            lease_success = '';
                            break;
                        case STATE_SET_IN_SUCCESS:
                            lease_class = 'selected'; // my leases
                            lease_success = 'success';
                        case STATE_SET_OUT_FAILURE:
                            lease_class = 'selected'; // my leases
                            lease_success = 'failure';
                            break;
                        case STATE_SET_OUT:
                            lease_class = 'reserved'; // other leases
                            lease_success = '';
                            break;
                        case STATE_SET_OUT_SUCCESS:
                            lease_class = 'free'; // other leases
                            lease_success = 'success';
                            break;
                        case STATE_SET_IN_FAILURE:
                            lease_class = 'free'; // other leases
                            lease_success = 'failure';
                            break;
                        case STATE_SET_IN_PENDING:
                            lease_class = 'pendingin';
                            lease_success = '';
                            break;
                        case STATE_SET_OUT_PENDING:
                            // pending_in & pending_out == IN == replacement
                            if (resource.leases[i].status == 'pendingin')
                                lease_class = 'pendingin'
                            else
                                lease_class = 'pendingout';
                            lease_success = '';
                            break;
                    
                    }
                    resource.leases[i].status = lease_class;
                    resource.leases[i].success = lease_success;
                }
            },

/* XXX IN TEMPLATE XXX
                if (SchedulerDataViewData.length == 0) {
                    $("#plugin-scheduler").hide();
                    $("#plugin-scheduler-empty").show();
                    tmpScope.clearStuff();
                } else {
                    $("#plugin-scheduler-empty").hide();
                    $("#plugin-scheduler").show();
                    // initSchedulerResources
                    tmpScope.initSchedulerResources(schedulerMaxRows < SchedulerDataViewData.length ? schedulerMaxRows : SchedulerDataViewData.length);
                }
*/

            /**
             * Initialize the date picker, the table, the slider and the buttons. Once done, display scheduler.
             */
            _initUI: function() 
            {
                var self = this;
                var scope = self._get_scope();

                var num_hidden_cells;

                $("#DateToRes").datepicker({
                    onRender: function(date) {
                        return date.valueOf() < now.valueOf() ? 'disabled' : '';
                    }
                }).on('changeDate', function(ev) {
                    SchedulerDateSelected = new Date(ev.date);
                    SchedulerDateSelected.setHours(0,0,0,0);
                    // Set slider to origin
                    //$('#tblSlider').slider('setValue', 0); // XXX
                    // Refresh leases
                    self._scope_clear_leases();
                    self._set_all_lease_slots();
                    // Refresh display
                    self._get_scope().$apply();
                }).datepicker('setValue', SchedulerDateSelected); //.data('datepicker');

                //init Slider
                num_hidden_cells = self._all_slots.length - self._num_visible_cells;
                init_cell = (new Date().getHours() - 1) * 3600 / self._granularity;
                if (init_cell > num_hidden_cells)
                    init_cell = num_hidden_cells;

                $('#tblSlider').slider({
                    min: 0,
                    max: num_hidden_cells,
                    value: init_cell,
                }).on('slide', function(ev) {
                    var scope = self._get_scope();
                    scope.from = ev.value;
                    scope.$apply();
                });
                scope.from = init_cell;
                scope.$apply();

                $("#plugin-scheduler-loader").hide();
                $("#plugin-scheduler").show();
            },

        // PRIVATE METHODS

        /**
         * Greatest common divisor
         */
        _gcd : function(x, y)
        {
            return (y==0) ? x : this._gcd(y, x % y);
        },

        _gcdn : function(array)
        {
            var self = this;
            return array.reduce(function(prev, cur, idx, arr) { return self._gcd(prev, cur); });
        },

        /**
         * Least common multiple
         */
        _lcm : function(x, y)
        {
            return x * y / this._gcd(x, y);
        },

        _lcmn : function(array)
        {
            var self = this;
            return array.reduce(function(prev, cur, idx, arr) { return self._lcm(prev, cur); });
        },
    
        _pad_str : function(i)
        {
            return (i < 10) ? "0" + i : "" + i;
        },

        /**
         * Member variables used:
         *   _granularity
         * 
         * Returns:
         *   A list of {id, time} dictionaries.
         */
        _generate_all_slots: function()
        {
            var slots = [];
            // Start with a random date (a first of a month), only time will matter
            var d = new Date(2014, 1, 1, 0, 0, 0, 0);
            var i = 0;
            // Loop until we change the day
            while (d.getDate() == 1) {
                // Nicely format the time...
                var tmpTime = this._pad_str(d.getHours()) + ':' + this._pad_str(d.getMinutes());
                /// ...and add the slot to the list of results
                slots.push({ id: i, time: tmpTime });
                // Increment the date with the granularity
                d = new Date(d.getTime() + this._slot_length * 1000);
                i++;
            }
            return slots;

        },
    });

    /* Plugin registration */
    $.plugin('Scheduler2', scheduler2);

})(jQuery);



