<<<<<<< HEAD
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

/* some params */
var init_start_visible_index = 10;
var init_end_visible_index = 21;
var rsvrTblNm = "scheduler-reservation-table";
var SchedulerResources = [];
var schdlr_totalColums = 0;
var SetPerFun = null;
var Sched2 = null;
var Debug = true;
var schdlr_PartsInOneHour = 6;

(function ($) {
    var Scheduler2 = Plugin.extend({

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function (options, element) {
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            schdlr_totalColums = $("#scheduler-reservation-table th").length;

            //selection from table 
            $(window).keydown(function (evt) {
                if (evt.which == 17) { // ctrl
                    ctrlPressed = true;
                }
            }).keyup(function (evt) {
                if (evt.which == 17) { // ctrl
                    ctrlPressed = false;
                }
            });
            $("#" + rsvrTblNm).on('mousedown', 'td', rangeMouseDown).on('mouseup', 'td', rangeMouseUp).on('mousemove', 'td', rangeMouseMove);

            // Explain this will allow query events to be handled
            // What happens when we don't define some events ?
            // Some can be less efficient

            if (Debug) console.time("Listening_to_queries");
            /* Listening to queries */
            this.listen_query(options.query_uuid, 'all_ev');
            this.listen_query(options.query_all_resources_uuid, 'all_resources');
            this.listen_query(options.query_lease_uuid, 'lease');
            //this.listen_query(options.query_lease_uuid, 'lease');
            if (Debug) console.timeEnd("Listening_to_queries");

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

        show_hide_button: function () {
            // this.id, this.el, this.cl, this.elts
            // same output as a jquery selector with some guarantees
        },

        drawResources: function () {
            
            //if (Debug) this.debug('foo');
            if (Debug) console.time("each:SchedulerResources");

            //scheduler-reservation-table main table columns
            totalColums = $("#scheduler-reservation-table thead tr th").length;
            //var totalCell = [];
            //for (var i = 0; i < totalColums; i++) { totalCell.push("<td></td>"); }
            //var srt_body = [];
            var totalCell = "";
            for (var i = 0; i < totalColums; i++) totalCell +="<td></td>"; 
            var srt_body = "";

            $.each(SchedulerResources, function (i, group) {
                //var groupTR = $("#ShedulerNodes tbody").html('<tr><td class="no-image verticalIndex" rowspan="' + group.resources.length + '"><div class="verticalText">' + group.groupName + '</div></td><td id="schdlr_frstTD" class="info fixed"></td></tr>');
                var groupTR = $("#ShedulerNodes tbody").html('<tr><td class="no-image verticalIndex" rowspan="' + 30 + '"><div class="verticalText">' + group.groupName + '</div></td><td id="schdlr_frstTD" class="info fixed"></td></tr>');
                
                $.each(group.resources.slice(0,30), function (i, resource) {
                    if (i == 0) {
                        //$("#ShedulerNodes tbody tr:first").append('<td class="info fixed">' + resource.hostname + '</td>');
                        $(groupTR).find("#schdlr_frstTD").html(resource.hostname);
                        //$(srt_body).html("<tr>" + totalCell + "</tr>");
                    } else {
                        $(groupTR).find("tr:last").after('<tr><td class="info fixed">' + resource.hostname + '</td></tr>');
                        //$(srt_body).find("tr:last").after("<tr>" + totalCell + "</tr>");
                    }
                    srt_body += "<tr>" + totalCell + "</tr>";
                    //srt_body.push('<tr>'); srt_body = srt_body.concat(totalCell.concat()); srt_body.push('/<tr>');
                });
            });

            //$("#scheduler-reservation-table tbody").html(srt_body.join(""));
            $("#scheduler-reservation-table tbody").html(srt_body);

            if (Debug) console.timeEnd("each:SchedulerResources");
            

            $("#" + rsvrTblNm + " tbody tr").each(function (index) { $(this).attr("data-trindex", index); });

        },

        /* TEMPLATES */

        // see in the html template
        // How to load a template, use of mustache

        /* QUERY HANDLERS */
        loadWithDate: function () {
            // only convention, not strictly enforced at the moment
        },
        // How to make sure the plugin is not desynchronized
        // He should manifest its interest in filters, fields or records
        // functions triggered only if the proper listen is done

        /* all_ev QUERY HANDLERS Start */
        on_all_ev_clear_records: function (data) {
            //alert('all_ev clear_records');
        },
        on_all_ev_query_in_progress: function (data) {
           // alert('all_ev query_in_progress');
        },
        on_all_ev_new_record: function (data) {
            //alert('all_ev new_record');
        },
        on_all_ev_query_done: function (data) {
            //alert('all_ev query_done');
        },
        //another plugin has modified something, that requires you to update your display. 
        on_all_ev_field_state_changed: function (data) {
            //alert('all_ev query_done');
        },
        /* all_ev QUERY HANDLERS End */
        /* all_resources QUERY HANDLERS Start */
        on_all_resources_clear_records: function (data) {
            //data is empty on load
        },
        on_all_resources_query_in_progress: function (data) {
            //data is empty on load
        },
        on_all_resources_new_record: function (data) {
            var tmpGroup = lookup(SchedulerResources, 'groupName', data.type);
            if (tmpGroup == null) {
                tmpGroup = { groupName: data.type, resources: [] };
                SchedulerResources.push(tmpGroup);
                //if (data.type != "node")  alert('not all node');
            }
            tmpGroup.resources.push(data);
            //alert('new_record');
        },
        on_all_resources_query_done: function (data) {
            this.drawResources();
            //data is empty on load
            /* GUI setup and event binding */
            this._initUI();
            this._SetPeriodInPage(init_start_visible_index, init_end_visible_index);
            this.loadWithDate();
        },
        //another plugin has modified something, that requires you to update your display. 
        on_all_resources_field_state_changed: function (data) {
            //alert('all_resources query_done');
        },
        /* all_resources QUERY HANDLERS End */
        /* lease QUERY HANDLERS Start */
        on_lease_clear_records: function (data) { alert('clear_records'); },
        on_lease_query_in_progress: function (data) { alert('query_in_progress'); },
        on_lease_new_record: function (data) { alert('new_record'); },
        on_lease_query_done: function (data) { alert('query_done'); },
        //another plugin has modified something, that requires you to update your display. 
        on_lease_field_state_changed: function (data) { alert('query_done'); },
        /* lease QUERY HANDLERS End */


        // no prefix

        on_filter_added: function (filter) {

        },

        // ... be sure to list all events here

        /* RECORD HANDLERS */
        on_all_new_record: function (record) {
            //
            alert('on_all_new_record');
        },

        debug : function (log_txt) {
            if (typeof window.console != 'undefined') {
                console.debug(log_txt);
            }
        },

        /* INTERNAL FUNCTIONS */
        _initUI: function () {
            if (Debug) console.time("_initUI");
            //fix margins in tables
            mtNodesTbl = $("#" + rsvrTblNm + " tr:first").outerHeight() + 6;
            mtSchrollCon = $("#nodes").outerWidth();
            $("#nodes").css("margin-top", mtNodesTbl);
            $("#reservation-table-scroll-container").css("margin-left", mtSchrollCon);
            SetPerFun = this._SetPeriodInPage;
            //slider
            $("#time-range").slider({
                range: true,
                min: 0,
                max: 24,
                step: 0.5,
                values: [init_start_visible_index, init_end_visible_index],
                slide: function (event, ui) {
                    SetPerFun(ui.values[0], ui.values[1]);
                }
            });
            $("#DateToRes").datepicker({
                dateFormat: "yy-mm-dd",
                minDate: 0,
                numberOfMonths: 3
            }).change(function () {
                //Scheduler2.loadWithDate();
            }).click(function () {
                $("#ui-datepicker-div").css("z-index", 5);
            });
            //other stuff
            fixOddEvenClasses();
            $("#" + rsvrTblNm + " td:not([class])").addClass("free");
            if (Debug) console.timeEnd("_initUI");
        },
        _SetPeriodInPage: function (start, end) {
            if (Debug) console.time("_SetPeriodInPage");
            ClearTableSelection();
            $("#lbltime").html(GetTimeFromInt(start) + " - " + GetTimeFromInt(end));
            
            var start_visible_index = (start * schdlr_PartsInOneHour) + 1;
            var end_visible_index = (end * schdlr_PartsInOneHour);

            //hide - show
            for (i = 0; i < start_visible_index; i++) {
                $("#" + rsvrTblNm + " td:nth-child(" + i + "), #" + rsvrTblNm + " th:nth-child(" + i + ")").hide();
            }
            for (i = end_visible_index + 1; i <= schdlr_totalColums; i++) {
                $("#" + rsvrTblNm + " td:nth-child(" + i + "), #" + rsvrTblNm + " th:nth-child(" + i + ")").hide();
            }
            /*$("#" + rsvrTblNm + " td:not([class*='info']), #" + rsvrTblNm + " th:not([class*='fixed'])").hide();*/
            for (i = start_visible_index; i <= end_visible_index; i++) {
                $("#" + rsvrTblNm + " td:nth-child(" + i + "), #" + rsvrTblNm + " th:nth-child(" + i + ")").show();
            }

            if ($("#" + rsvrTblNm + " th:visible:first").width() > 105) {
                $("#" + rsvrTblNm + " th span").css("display", "inline")
            } else {
                $("#" + rsvrTblNm + " th span").css("display", "block");
            }
            mtNodesTbl = $("#" + rsvrTblNm + " tr:first").outerHeight() + 6;
            $("#nodes").css("margin-top", mtNodesTbl);
            //$("#scroll_container").width($("#Search").width() - $("#nodes").width());
            //$("#nodes th").height($("#tblReservation th:visible:first").height() - 2);
            if (Debug) console.timeEnd("_SetPeriodInPage");
        }
    });

    //Sched2 = new Scheduler2();

    /* Plugin registration */
    $.plugin('Scheduler2', Scheduler2);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.


})(jQuery);



=======
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
            prev_state = manifold.query_store.get_record_state($scope.instance.options.query_uuid, resource_urn, STATE_SET);
            manifold.raise_event($scope.instance.options.query_lease_uuid, FIELD_STATE_CHANGED, data);

            /* Add to local cache also, unless we listen to events from outside */
            if (!(resource_urn in $scope._leases_by_resource)){
                $scope._leases_by_resource[resource_urn] = [];
                /* Add the resource of the selected timeslot to the pending list */
                data_resource = {
                    state: STATE_SET,
                    key  : null,
                    op   : STATE_SET_ADD,
                    value: resource_urn
                };
                /* Send the message to the list of resources, depending on the previous state */
                prev_state = manifold.query_store.get_record_state($scope.instance.options.query_uuid, data_resource.value, STATE_SET);
                if(jQuery.inArray(prev_state,[STATE_SET_OUT,STATE_SET_OUT_SUCCESS,STATE_SET_OUT_PENDING,STATE_SET_IN_FAILURE])>-1){
                    manifold.raise_event($scope.instance.options.query_uuid, FIELD_STATE_CHANGED, data_resource);
                }
                /* Remove the warning on resource as we have added Leases to it */
                //manifold.raise_event($scope.instance.options.query_uuid, STATUS_REMOVE_WARNING, data_resource);
            }
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
            prev_state = manifold.query_store.get_record_state($scope.instance.options.query_uuid, other.resource, STATE_SET);
            manifold.raise_event($scope.instance.options.query_lease_uuid, FIELD_STATE_CHANGED, data);
            /* Remove Lease from local cache also, unless we listen to events from outside */
            $scope._leases_by_resource[other.resource] = $.grep($scope._leases_by_resource[other.resource], function(x) { return x != other; });
            /* Last lease removed for this resource -> remove the resource from the list */
            if($scope._leases_by_resource.hasOwnProperty(other.resource) && $scope._leases_by_resource[other.resource].length == 0){
                /* remove resource from the list of selected resources */
                 data_resource = {
                    state: STATE_SET,
                    key  : null,
                    op   : STATE_SET_REMOVE,
                    value: other.resource
                };

                prev_state = manifold.query_store.get_record_state($scope.instance.options.query_uuid, data_resource.value, STATE_SET);
                /* Remove Resource from local cache */
                delete $scope._leases_by_resource[data_resource.value]
                /* Send the message to the list of resources, depending on the previous state */
                if(jQuery.inArray(prev_state,[STATE_SET_IN,STATE_SET_IN_SUCCESS,STATE_SET_IN_PENDING,STATE_SET_OUT_FAILURE])>-1){
                    manifold.raise_event($scope.instance.options.query_uuid, FIELD_STATE_CHANGED, data_resource);
                    //manifold.raise_event($scope.instance.options.query_uuid, STATUS_REMOVE_WARNING, data_resource);
                }
               
            }
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
            

            //$scope._dump_leases();
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
                    if(resource.available == 'false' || resource.boot_state == 'disabled'){
                        state = 'maintenance';
                    }else{
                        state = 'free';
                    }
                    var colspan_lease = resource.granularity / self._slot_length; //eg. 3600 / 1800 => 2 cells
                    time = SchedulerDateSelected.getTime();
                    for (i=0; i < self._all_slots.length / colspan_lease; i++) { // divide by granularity
                        resource.leases.push({
                            id:     'coucou',
                            status: (time < now) ? 'disabled':  state, //'free', // 'selected', 'reserved', 'maintenance' XXX pending ??
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
                    //console.log("SET LEASES", lease.resource, new Date(lease.start_time* 1000), new Date(lease.end_time* 1000));
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

            on_resources_field_state_changed: function(data)
            {
                console.log('on_resources_field_state_changed');
                console.log(data);
                switch(data.state) {
                    case STATE_SET:
                        switch(data.op) {
                            /*
                            case STATE_SET_IN:
                            case STATE_SET_IN_SUCCESS:
                            case STATE_SET_OUT_FAILURE:
                                //this.set_checkbox_from_data(data.value, true);
                                //this.set_bgcolor(data.value, QUERYTABLE_BGCOLOR_RESET);
                                break;  
                            */
                            case STATE_SET_OUT:
                            case STATE_SET_OUT_SUCCESS:
                            case STATE_SET_IN_FAILURE:
                                // A resource has been removed
                                console.log(this._get_scope()._leases_by_resource);
                                s = this._get_scope();
                                // loop over the list of leases by resource cached
                                $.each(this._get_scope()._leases_by_resource, function(k,v){
                                    // if the resource removed is in the list
                                    // we need to remove all the leases corresponding to that resoruce
                                    if(k == data.value){
                                        console.log(k,v);
                                        // loop each lease should be removed
                                        $.each(v, function(i,lease){
                                            console.log(i,lease);
                                            s._remove_lease(lease);
                                        });
                                    }
                                });
                                break;
                            /*
                            case STATE_SET_IN_PENDING:
                                this.set_checkbox_from_data(data.key, true);
                                this.set_bgcolor(data.value, QUERYTABLE_BGCOLOR_ADDED);
                                break;  
                            case STATE_SET_OUT_PENDING:
                                this.set_checkbox_from_data(data.key, false);
                                this.set_bgcolor(data.value, QUERYTABLE_BGCOLOR_REMOVED);
                                break;
                            */
                        }
                        break;
                    /*
                    case STATE_WARNINGS:
                        this.change_status(data.key, data.value);
                        break;
                    */
                }
            },


            /* INTERNAL FUNCTIONS */

            _set_lease_slots: function(lease_key, lease)
            {
                var resource, lease_status, lease_class;
                var day_timestamp, id_start, id_end, colspan_lease;

                resource = this.scope_resources_by_key[lease.resource];
                day_timestamp = SchedulerDateSelected.getTime() / 1000;
                if(resource === undefined){
                    console.log('resource undefined = '+lease.resource);
                    return;
                }
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
                lease_status = manifold.query_store.get_record_state(this.options.query_lease_uuid, lease_key, STATE_SET);
                // the same slots might be affected multiple times.
                // PENDING_IN + PENDING_OUT => IN 
                //
                // RESERVED vs SELECTED !
                //
                // PENDING !!
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

                for (i = id_start; i < id_end; i++) {
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
                	dateFormat: "D, d M yy",
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



>>>>>>> onelab
