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
var SCHEDULER_FIRST_COLWIDTH = 150;


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
                this.classname = "scheduler2";
                // Call the parent constructor, see FAQ when forgotten
                this._super(options, element);

                var scope = this._get_scope()

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

                /* Generate slots according to the default granularity. Should
                 * be updated when resources arrive.  Should be the pgcd in fact XXX */
                this._granularity = DEFAULT_GRANULARITY;
                scope.granularity = this._granularity;
                this._all_slots = this._generate_all_slots();

                $('#' + schedulerTblId + ' thead tr th:eq(0)').css("width", SCHEDULER_FIRST_COLWIDTH);
                //this get width might need fix depending on the template 
                var tblwidth = $('#scheduler-tab').parent().outerWidth();

                /* Number of visible cells...*/
                this._num_visible_cells = parseInt((tblwidth - SCHEDULER_FIRST_COLWIDTH) / SCHEDULER_COLWIDTH);
                /* ...should be a multiple of the lcm of all encountered granularities. */
                // XXX Should be updated everytime a new resource is added
                this._lcm_colspan = this._lcm(this._granularity, RESOURCE_DEFAULT_GRANULARITY) / this._granularity;
                this._num_visible_cells = this._num_visible_cells - this._num_visible_cells % this._lcm_colspan;
                /* scope also needs this value */
                scope.num_visible_cells = this._num_visible_cells;
                scope.lcm_colspan = this._lcm_colspan;

                scope.options = this.options;
                scope.from = 0;

                // A list of {id, time} dictionaries representing the slots for the given day
                scope.slots = this._all_slots;
                this.scope_resources_by_key = {};

                this._initUI();

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
                    resource.granularity = typeof(resource.granularity) == "number" ? resource.granularity : RESOURCE_DEFAULT_GRANULARITY;
                    resource.leases = []; // a list of occupied timeslots

                    self.scope_resources_by_key[resource['urn']] = resource;
                    scope.resources.push(resource);
                });
            },

            _scope_clear_leases: function()
            {
                var self = this;
                var scope = this._get_scope();

                // Setup leases with a default free status...
                $.each(this.scope_resources_by_key, function(resource_key, resource) {
                    resource.leases = [];
                    var colspan_lease = resource.granularity / self._granularity; //eg. 3600 / 1800 => 2 cells
                    for (i=0; i < self._all_slots.length / colspan_lease; i++) { // divide by granularity
                        resource.leases.push({
                            id:     'coucou',
                            status: 'free', // 'selected', 'reserved', 'maintenance' XXX pending ??
                        });
                    }
                });

            },

            _scope_set_leases: function()
            {
                var self = this;
                var scope = this._get_scope();
            
                var leases = manifold.query_store.get_records(this.options.query_lease_uuid);
                $.each(leases, function(i, lease) {

                    console.log("SET LEASES", new Date(lease.start_time* 1000));
                    console.log("          ", new Date(lease.end_time* 1000));
                    // XXX We should ensure leases are correctly merged, otherwise our algorithm won't work

                    // Populate leases by resource array: this will help us merging leases later
                    if (!(lease.resource in scope._leases_by_resource))
                        scope._leases_by_resource[lease.resource] = [];
                    scope._leases_by_resource[lease.resource].push(lease);

                    var resource = self.scope_resources_by_key[lease.resource];
                    var day_timestamp = SchedulerDateSelected.getTime() / 1000;

                    var id_start = (lease.start_time - day_timestamp) / resource.granularity;
                    if (id_start < 0) {
                        /* Some leases might be in the past */
                        id_start = 0;
                    }
    
                    var id_end   = (lease.end_time   - day_timestamp) / resource.granularity - 1;
                    var colspan_lease = resource.granularity / self._granularity; //eg. 3600 / 1800 => 2 cells
                    if (id_end >= self._all_slots.length / colspan_lease) {
                        /* Limit the display to the current day */
                        id_end = self._all_slots.length / colspan_lease
                    }

                    for (i = id_start; i <= id_end; i++)
                        // the same slots might be affected multiple times.
                        // PENDING_IN + PENDING_OUT => IN 
                        //
                        // RESERVED vs SELECTED !
                        //
                        // PENDING !!
                        resource.leases[i].status = 'selected'; 
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

            /* INTERNAL FUNCTIONS */

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

                $("#DateToRes").datepicker({
                    dateFormat: "yy-mm-dd",
                    minDate: 0,
                    numberOfMonths: 3
                }).change(function() {
                    // the selected date
                    SchedulerDateSelected = $("#DateToRes").datepicker("getDate");
                    if (SchedulerDateSelected == null || SchedulerDateSelected == '') {
                        alert("Please select a date, so the scheduler can reserve leases.");
                        return;
                    }
                    // Set slider to origin
                    $('#tblSlider').slider('value', 0);
                    // Refresh leases
                    self._scope_clear_leases();
                    self._scope_set_leases();
                    // Refresh display
                    self._get_scope().$apply();
                }).datepicker('setDate', SchedulerDateSelected);

                //init Slider
                $('#tblSlider').slider({
                    min: 0,
                    max: (this._all_slots.length - self._num_visible_cells) / self._lcm_colspan,
                    value: 0,
                    slide: function(event, ui) {
                        var scope = self._get_scope();
                        scope.from = ui.value * self._lcm_colspan;
                        scope.$apply();
                   }
                });

                $('#btnSchedulerSubmit').click(this._on_submit);

                $("#plugin-scheduler-loader").hide();
                $("#plugin-scheduler").show();
            },

        // GUI EVENTS

        // TO BE REMOVED
        _on_submit : function()
        {
            var leasesForCommit = new Array();
            var tmpDateTime = SchedulerDateSelected;
            for (var i = 0; i < SchedulerData.length; i++)
            {
                var tpmR = SchedulerData[i];
                //for capturing start and end of the lease
                var newLeaseStarted = false;
                for (var j = 0; j < tpmR.leases.length; j++) {
                    var tpmL = tpmR.leases[j];
                    if (newLeaseStarted == false && tpmL.status == 'selected') {
                        //get date of the slot
                        tmpDateTime = schedulerGetDateTimeFromSlotId(tpmL.id, tmpDateTime);
                        var unixStartTime = tmpDateTime.getTime() / 1000;
                        //add lease object
                        leasesForCommit.push({
                            resource: tpmR.id,
                            //granularity: tpmR.granularity,
                            //lease_type: null,
                            //slice: null,
                            start_time: unixStartTime,
                            end_time: null,
                            //duration: null
                        });
                        console.log(tpmR.id);
                        newLeaseStarted = true;
                    } else if (newLeaseStarted == true && tpmL.status != 'selected') {
                        //get date of the slot
                        tmpDateTime = schedulerGetDateTimeFromSlotId(tpmL.id, tmpDateTime);
                        var unixEndTime = tmpDateTime.getTime() / 1000;
                        //upate end_time
                        var tmpCL = leasesForCommit[leasesForCommit.length - 1];
                        tmpCL.end_time = unixEndTime;
                        //tmpCL.duration = schedulerFindDuration(tmpCL.start_time, tmpCL.end_time, tmpCL.granularity);
                        newLeaseStarted = false;
                    }
                }
            }
            console.log(leasesForCommit);
            for (var i = 0; i < leasesForCommit.length; i++) {
                manifold.raise_event(scheduler2Instance.options.query_lease_uuid, SET_ADD, leasesForCommit[i]);
            }
        },
        
        // PRIVATE METHODS

        /**
         * Greatest common divisor
         */
        _gcd : function(x, y)
        {
            return (y==0) ? x : this._gcd(y, x % y);
        },

        /**
         * Least common multiple
         */
        _lcm : function(x, y)
        {
            return x * y / this._gcd(x, y);
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
                d = new Date(d.getTime() + this._granularity * 1000);
                i++;
            }
            return slots;

        },
    });

    /* Plugin registration */
    $.plugin('Scheduler2', scheduler2);

})(jQuery);



