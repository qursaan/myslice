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
var scheduler2;
var scheduler2Instance;
//is ctrl keyboard button pressed
var schedulerCtrlPressed = false;
//table Id
var schedulerTblId = "scheduler-reservation-table";
var schedulerTblFirstColWidth = 150;
//Some Data
var schedulerSlotsPerHour = 6;
var schedulerMaxRows = 12;
var SchedulerData = [];
var SchedulerSlots = [];
var SchedulerDateSelected = new Date();
var SchedulerDataViewData = [];
var SchedulerSlotsViewData = [];
var SchedulerTotalCells;
var SchedulerTotalVisibleCells;
//Help Variables
var _schedulerCurrentCellPosition = 0;
var _leasesDone = false;
var _resourcesDone = false;
//Enable Debug
var schedulerDebug = true;
//tmp to delete
var tmpSchedulerLeases = [];

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
                scheduler2Instance = this;
                // We need to remember the active filter for datatables filtering
                this.filters = Array();


                SchedulerSlots = schedulerGetSlots(60 / schedulerSlotsPerHour);
                //selection from table 
                $(window).keydown(function(evt) {
                    if (evt.which == 17) { // ctrl
                        schedulerCtrlPressed = true;
                    }
                }).keyup(function(evt) {
                    if (evt.which == 17) { // ctrl
                        schedulerCtrlPressed = false;
                    }
                });
                $("#" + schedulerTblId).on('mousedown', 'td', rangeMouseDown).on('mouseup', 'td', rangeMouseUp).on('mousemove', 'td', rangeMouseMove);

                // Explain this will allow query events to be handled
                // What happens when we don't define some events ?
                // Some can be less efficient

                if (schedulerDebug) console.time("Listening_to_queries");
                /* Listening to queries */

                this.listen_query(options.query_uuid);
                //this.listen_query(options.query_all_uuid, 'all');
                this.listen_query(options.query_all_resources_uuid, 'all_resources');
                this.listen_query(options.query_lease_uuid, 'lease');
                this.listen_query(options.query_all_leases_uuid, 'all_leases');
                if (schedulerDebug) console.timeEnd("Listening_to_queries");

            },

            /* Handlers */

            /* all_ev QUERY HANDLERS Start */
            on_all_ev_clear_records: function(data) {
                //alert('all_ev clear_records');
            },
            on_all_ev_query_in_progress: function(data) {
                // alert('all_ev query_in_progress');
            },
            on_all_ev_new_record: function(data) {
                //alert('all_ev new_record');
            },
            on_all_ev_query_done: function(data) {
                //alert('all_ev query_done');
            },
            //another plugin has modified something, that requires you to update your display. 
            on_all_ev_field_state_changed: function(data) {
                //alert('all_ev query_done');
            },
            /* all_ev QUERY HANDLERS End */
            /* all_resources QUERY HANDLERS Start */
            on_all_resources_clear_records: function(data) {
                //data is empty on load
            },
            on_all_resources_query_in_progress: function(data) {
                //data is empty on load
            },
            on_all_resources_new_record: function(data) {
                //alert(data.toSource());
                if (data.exclusive == true) {
                    var tmpGran = schedulerDebug && data.granularity == null ? 1800 : data.granularity;
                    SchedulerData.push({
                        id: data.urn,
                        index: SchedulerData.length,
                        name: data.hrn,
                        granularity: tmpGran,
                        leases: schedulerGetLeases(60 / schedulerSlotsPerHour, tmpGran),
                        type: data.type,
                        org_resource: data
                    });
                    /*if (schedulerDebug && SchedulerData[SchedulerData.length - 1].org_resource.network_hrn == 'omf') {
                        SchedulerData[SchedulerData.length - 1].granularity = 1800;
                    }*/
                }
                //alert(data.toSource());

            },
            on_all_resources_query_done: function(data) {
                _resourcesDone = true;
                this._initScheduler();
            },
            //another plugin has modified something, that requires you to update your display. 
            on_all_resources_field_state_changed: function(data) {
                //alert('all_resources query_done');
            },
            /* all_resources QUERY HANDLERS End */
            /* lease QUERY HANDLERS Start */
            on_lease_clear_records: function(data) { console.log('clear_records'); },
            on_lease_query_in_progress: function(data) { console.log('lease_query_in_progress'); },
            on_all_leases_new_record: function(data) {
                if (data.resource.indexOf("nitos") > -1) {
                    tmpSchedulerLeases.push({
                        id: schedulerGetSlotId(data.start_time, data.duration, data.granularity),
                        end_id: schedulerGetSlotId(data.end_time, data.duration, data.granularity),
                        slice: data.slice,
                        status: 'reserved',
                        resource: data.resource,
                        network: data.network,
                        start_time: new Date(data.start_time * 1000),
                        start_time_unixtimestamp: data.start_time,
                        end_time: new Date(data.end_time * 1000),
                        end_time_unixtimestamp: data.end_time,
                        lease_type: data.lease_type,
                        granularity: data.granularity,
                        duration: data.duration
                    });
                }
                //console.log(data.toSource()); console.log('lease_new_record');
            },
            on_all_leases_query_done: function(data) {
                _leasesDone = true;
                this._initScheduler();
                // console.log('lease_query_done');
            },
            //another plugin has modified something, that requires you to update your display. 
            on_lease_field_state_changed: function(data) { console.log('lease_field_state_changed'); },
            /* lease QUERY HANDLERS End */


            // no prefix
            on_filter_added: function(filter) {
                this.filters.push(filter);
                this._SetFiletredResources(this.filters);
                //angular and UI
                var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
                if (SchedulerDataViewData.length == 0) {
                    $("#plugin-scheduler").hide();
                    $("#plugin-scheduler-empty").show();
                    tmpScope.clearStuff();
                } else {
                    $("#plugin-scheduler-empty").hide();
                    $("#plugin-scheduler").show();
                    tmpScope.initSchedulerResources(schedulerMaxRows < SchedulerDataViewData.length ? schedulerMaxRows : SchedulerDataViewData.length);
                }
            },

            on_filter_removed: function(filter) {
                // Remove corresponding filters
                this.filters = $.grep(this.filters, function(x) {
                    return x == filter;
                });
                this._SetFiletredResources(this.filters);
                //angular and UI
                var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
                if (SchedulerDataViewData.length == 0) {
                    $("#plugin-scheduler").hide();
                    $("#plugin-scheduler-empty").show();
                    tmpScope.clearStuff();
                } else {
                    $("#plugin-scheduler-empty").hide();
                    $("#plugin-scheduler").show();
                    tmpScope.initSchedulerResources(schedulerMaxRows < SchedulerDataViewData.length ? schedulerMaxRows : SchedulerDataViewData.length);
                }
            },

            on_filter_clear: function() {
                this.filters = [];
                this._SetFiletredResources(this.filters);
                //angular and UI
                var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
                if (SchedulerDataViewData.length == 0) {
                    $("#plugin-scheduler").hide();
                    $("#plugin-scheduler-empty").show();
                    tmpScope.clearStuff();
                } else {
                    $("#plugin-scheduler-empty").hide();
                    $("#plugin-scheduler").show();
                    tmpScope.initSchedulerResources(schedulerMaxRows < SchedulerDataViewData.length ? schedulerMaxRows : SchedulerDataViewData.length);
                }
            },

            on_all_leases_filter_added: function(filter) {
                console.log("Filter on Leases added !");
            },

            // ... be sure to list all events here

            /* RECORD HANDLERS */
            on_all_new_record: function(record) {
                //alert('on_all_new_record');
            },

            debug: function(logTxt) {
                if (typeof window.console != 'undefined') {
                    console.debug(logTxt);
                }
            },

            /* INTERNAL FUNCTIONS */
            _initScheduler: function() {
                if (_resourcesDone && _leasesDone) {
                    SchedulerDataViewData = SchedulerData;
                    /* GUI setup and event binding */
                    this._FixLeases();
                    this._initUI();
                }
            },

            _initUI: function() {
                //alert(1);
                if (schedulerDebug) console.time("_initUI");
                //init DatePicker Start
                $("#DateToRes").datepicker({
                    dateFormat: "yy-mm-dd",
                    minDate: 0,
                    numberOfMonths: 3
                }).change(function() {
                    //Scheduler2.loadWithDate();
                    SchedulerDateSelected = $("#DateToRes").datepicker("getDate");
                    if (SchedulerDateSelected != null && SchedulerDateSelected != '') {
                        for (var i = 0; i < SchedulerData.length; i++) {
                            SchedulerData[i].leases = schedulerGetLeases(60 / schedulerSlotsPerHour, SchedulerData[i].granularity);
                        }
                        scheduler2Instance._FixLeases();
                        $('#tblSlider').slider('value', 0);
                        var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
                        tmpScope.initSchedulerResources(schedulerMaxRows < SchedulerDataViewData.length ? schedulerMaxRows : SchedulerDataViewData.length);

                        console.log(SchedulerDateSelected);
                        console.log(SchedulerDateSelected.getTime()/1000);
                        var tomorrow = new Date(SchedulerDateSelected);
                        tomorrow.setDate(SchedulerDateSelected.getDate()+1);
                        console.log(tomorrow);
                        console.log(tomorrow.getTime()/1000);
                        
                        // Remove previous date interval
                        manifold.raise_event(scheduler2Instance.options.query_all_leases_uuid, FILTER_REMOVED, ['start_time', '>']);
                        manifold.raise_event(scheduler2Instance.options.query_all_leases_uuid, FILTER_REMOVED, ['start_time', '<']);

                        // Add new date interval
                        manifold.raise_event(scheduler2Instance.options.query_all_leases_uuid, FILTER_ADDED, ['start_time', '>', SchedulerDateSelected.getTime()/1000]);
                        manifold.raise_event(scheduler2Instance.options.query_all_leases_uuid, FILTER_ADDED, ['start_time', '<', tomorrow.getTime()/1000]);
                    } else {
                        alert("Please select a date, so the scheduler can reserve leases.");
                    }
                }).datepicker('setDate', SchedulerDateSelected);
                /*.click(function () {
                $("#ui-datepicker-div").css("z-index", 5);
            })*/
                //End init DatePicker

                //init Table
                this._FixTable();
                //End init Table

                //init Slider
                $('#tblSlider').slider({
                    min: 0,
                    max: SchedulerTotalCells - SchedulerTotalVisibleCells,
                    value: 0,
                    slide: function(event, ui) {
                        //$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                        //console.log(ui.value);
                        var angScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
                        if (_schedulerCurrentCellPosition > ui.value) {
                            angScope.moveBackSlot(ui.value, ui.value + SchedulerTotalVisibleCells);
                        } else if (_schedulerCurrentCellPosition < ui.value) {
                            angScope.moveFrontSlot(ui.value, ui.value + SchedulerTotalVisibleCells);
                        }
                        _schedulerCurrentCellPosition = ui.value;
                    }
                });
                //End init Slider


                //btn Submit leases
                $('#btnSchedulerSubmit').click(function () {
                    console.log("click btnSchedulerSubmit");
                    var leasesForCommit = new Array();
                    var tmpDateTime = SchedulerDateSelected;
                    console.log(SchedulerData);
                    for (var i = 0; i < SchedulerData.length; i++)
                    {
                        var tpmR = SchedulerData[i];
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
                });
                //


                //End btn Submit leases

                //other stuff
                $("#plugin-scheduler-loader").hide();
                $("#plugin-scheduler").show();
                //fixOddEvenClasses();
                //$("#" + schedulerTblId + " td:not([class])").addClass("free");
                if (schedulerDebug) console.timeEnd("_initUI");
            },

        _FixLeases  : function () {
            for (var i = 0; i < tmpSchedulerLeases.length; i++) {
                var tmpLea = tmpSchedulerLeases[i];
                if ((schedulerCompareOnDay(tmpLea.start_time, SchedulerDateSelected) == 0) ||
                                (tmpLea.start_time <= SchedulerDateSelected && SchedulerDateSelected <= tmpLea.end_time) || 
                                (schedulerCompareOnDay(tmpLea.end_time, SchedulerDateSelected) == 0)) {
                    var tmpRes = schedulerFindResourceById(SchedulerData, tmpLea.resource);
                    if (tmpRes != null) {
                        //Replace Lease with current lease from the manifold
                        var orgLease = tmpRes.leases[tmpLea.id];
                        tmpLea['groupid'] = orgLease.groupid;
                        tmpLea['groupIndex'] = orgLease.groupIndex;
                        if (orgLease.groupIndex != 0) {
                            if (!window.console) {
                                console.warn('there is an error with the leases of the resource :' + tmpRes.name + '\n The lease start in the middle of the granularity!' + '\n The Scheduler plugin might not work!');
                            }
                        }
                        tmpRes.leases[tmpLea.id] = tmpLea;
                        this._ExtractLeaseSlots(tmpRes, tmpRes.leases[tmpLea.id]);
                    }
                }
            }
        },

        _ExtractLeaseSlots: function (tmpRes, lease) {
            var tmpStartDate = lease.start_time;
            var tmpEndDate = lease.end_time;
            var startLoop; var toLoop;
            if (schedulerCompareOnDay(lease.start_time,lease.end_time) == 0) {
                //in the same date
                startLoop = lease.id;
                toLoop = lease.end_id;
            } else if (lease.start_time < SchedulerDateSelected && SchedulerDateSelected < lease.end_time) {
                //one hole day (more than 3days)
                startLoop = 0;
                toLoop = tmpRes.leases.length;
            } else if (schedulerCompareOnDay(lease.start_time, SchedulerDateSelected) == 0) {
                //the same day and extends
                startLoop = lease.id;
                toLoop = tmpRes.leases.length;
            } else if (schedulerCompareOnDay(lease.end_time, SchedulerDateSelected) == 0) {
                //extends to the last say
                startLoop = 0;
                toLoop = lease.end_id;
            }
            //var minutGran = tmpRes.granularity * 60;
            for (var li = lease.id; li < toLoop; li++) {
                tmpRes.leases[li].status = 'reserved';
            }
            
            //reserved
            //tmpRes.leases[tmpLea.id
        },

        _FixTable: function () {
            var colWidth = 50;
            SchedulerTotalCells = SchedulerSlots.length;
            $('#' + schedulerTblId + ' thead tr th:eq(0)').css("width", schedulerTblFirstColWidth); //.css("display", "block");
            //this get width might need fix depending on the template 
            var tblwidth = $('#scheduler-tab').parent().outerWidth();
            SchedulerTotalVisibleCells = parseInt((tblwidth - schedulerTblFirstColWidth) / colWidth);

            //if (SchedulerData.length == 0) {
            //    //puth some test data
            //    SchedulerData.push({ name: 'xyz+aaa', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'xyz+aaa', type: 'node' });
            //    SchedulerData.push({ name: 'xyz+bbb', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'xyz+bbb', type: 'node' });
            //    SchedulerData.push({ name: 'xyz+ccc', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'xyz+ccc', type: 'node' });
            //    SchedulerData.push({ name: 'nitos1', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'nitos1', type: 'node' });
            //}
            var tmpScope = angular.element(document.getElementById('SchedulerCtrl')).scope();
            tmpScope.initSchedulerResources(schedulerMaxRows < SchedulerDataViewData.length ? schedulerMaxRows : SchedulerDataViewData.length);

        },

        _SetFiletredResources : function (filters) {
            if (filters.length > 0) {
                SchedulerDataViewData = new Array();
                var tmpAddIt = true;
                for (var i = 0; i < SchedulerData.length; i++) {
                    loopfilters:
                    for (var f = 0; f < filters.length; f++) {
                        tmpAddIt = this._FilterResource(SchedulerData[i], filters[f]);
                        if (tmpAddIt == false) break loopfilters;
                    }
                    if (tmpAddIt) {
                        SchedulerDataViewData.push(SchedulerData[i]);
                    }
                }
            } else {
                SchedulerDataViewData = SchedulerData;
            }
        },

        _FilterResource: function (resource, filter) {
            var key = filter[0];
            var op = filter[1];
            var value = filter[2];
            var colValue = resource.org_resource[key];
            var ret = true;
            if (schedulerDebug &&  colValue == 'omf') colValue = 'nitos';

            if (op == '=' || op == '==') {
                if (colValue != value || colValue == null || colValue == "" || colValue == "n/a")
                    ret = false;
            } else if (op == 'included') {
                $.each(value, function (i, x) {
                    if (x == colValue) {
                        ret = true;
                        return false;
                    } else {
                        ret = false;
                    }
                });
            } else if (op == '!=') {
                if (colValue == value || colValue == null || colValue == "" || colValue == "n/a")
                    ret = false;
            }

            return ret;
        },

        _SetPeriodInPage: function (start, end) {
        }
    });

    //Sched2 = new Scheduler2();

    /* Plugin registration */
    $.plugin('Scheduler2', scheduler2);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.


})(jQuery);



