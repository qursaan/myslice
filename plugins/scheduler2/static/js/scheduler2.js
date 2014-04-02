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
//is ctrl keyboard button pressed
var schedulerCtrlPressed = false;
//table Id
var schedulerTblId = "scheduler-reservation-table";
var schedulerTblFirstColWidth = 150;
//Some Data
var schedulerSlotsPerHour = 6;
var schedulerMaxRows = 50;
var SchedulerData = [];
var SchedulerSlots = [];
var SchedulerDataViewData = [];
var SchedulerSlotsViewData = [];
var SchedulerTotalCells;
var SchedulerTotalVisibleCells;
//Help Variables
var _schedulerCurrentCellPosition = 0;
//Enable Debug
var schedulerDebug = true;

(function ($) {
    var scheduler2 = Plugin.extend({

        /** XXX to check
         * @brief Plugin constructor
         * @param options : an associative array of setting values
         * @param element : 
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        init: function (options, element) {
            this.classname="scheduler2";
            // Call the parent constructor, see FAQ when forgotten
            this._super(options, element);

            SchedulerSlots = schedulerGetSlots(60/schedulerSlotsPerHour);
            //selection from table 
            $(window).keydown(function (evt) {
                if (evt.which == 17) { // ctrl
                    schedulerCtrlPressed = true;
                }
            }).keyup(function (evt) {
                if (evt.which == 17) { // ctrl
                    schedulerCtrlPressed = false;
                }
            });
            //$("#" + schedulerTblId).on('mousedown', 'td', rangeMouseDown).on('mouseup', 'td', rangeMouseUp).on('mousemove', 'td', rangeMouseMove);

            // Explain this will allow query events to be handled
            // What happens when we don't define some events ?
            // Some can be less efficient

            if (schedulerDebug) console.time("Listening_to_queries");
            /* Listening to queries */
            this.listen_query(options.query_uuid, 'all_ev');
            this.listen_query(options.query_all_resources_uuid, 'all_resources');
            this.listen_query(options.query_lease_uuid, 'lease');
            //this.listen_query(options.query_lease_uuid, 'lease');
            if (schedulerDebug) console.timeEnd("Listening_to_queries");

        },

        /* Handlers */

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
            if (SchedulerData.length < schedulerMaxRows)
                SchedulerData.push({ name: data.hrn, leases: schedulerGetLeases(schedulerSlotsPerHour), urn: data.urn, type: data.type });
            //alert(data.toSource());
        },
        on_all_resources_query_done: function (data) {
            /* GUI setup and event binding */
            this._initUI();
            //this.loadWithDate();
        },
        //another plugin has modified something, that requires you to update your display. 
        on_all_resources_field_state_changed: function (data) {
            //alert('all_resources query_done');
        },
        /* all_resources QUERY HANDLERS End */
        /* lease QUERY HANDLERS Start */
        on_lease_clear_records: function (data) { console.log('clear_records'); },
        on_lease_query_in_progress: function (data) { console.log('lease_query_in_progress'); },
        on_lease_new_record: function (data) { alert(data.toSource()); console.log('lease_new_record'); },
        on_lease_query_done: function (data) { console.log('lease_query_done'); },
        //another plugin has modified something, that requires you to update your display. 
        on_lease_field_state_changed: function (data) { console.log('lease_field_state_changed'); },
        /* lease QUERY HANDLERS End */


        // no prefix

        on_filter_added: function (filter) {

        },

        // ... be sure to list all events here

        /* RECORD HANDLERS */
        on_all_new_record: function (record) {
            //alert('on_all_new_record');
        },

        debug : function (logTxt) {
            if (typeof window.console != 'undefined') {
                console.debug(logTxt);
            }
        },

        /* INTERNAL FUNCTIONS */
        _initUI: function () {
            if (schedulerDebug) console.time("_initUI");
            //init DatePicker Start
            $("#DateToRes").datepicker({
                dateFormat: "yy-mm-dd",
                minDate: 0,
                numberOfMonths: 3
            }).change(function () {
                //Scheduler2.loadWithDate();
            }).click(function () {
                $("#ui-datepicker-div").css("z-index", 5);
            });
            //End init DatePicker
            
            //init Table
            this._FixTable();
            //End init Table

            //init Slider
            $('#tblSlider').slider({
                min: 0,
                max: SchedulerTotalCells - SchedulerTotalVisibleCells - 1,
                value: 0,
                slide: function (event, ui) {
                    //$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
                    //console.log(ui.value);
                    if (_schedulerCurrentCellPosition > ui.value)
                        angular.element(document.getElementById('SchedulerCtrl')).scope().moveBackSlot(ui.value, ui.value + SchedulerTotalVisibleCells);
                    else if (_schedulerCurrentCellPosition < ui.value)
                        angular.element(document.getElementById('SchedulerCtrl')).scope().moveFrontSlot(ui.value, ui.value + SchedulerTotalVisibleCells);
                    _schedulerCurrentCellPosition = ui.value;
                }
            });
            //End init Slider

            //other stuff
            //fixOddEvenClasses();
            //$("#" + schedulerTblId + " td:not([class])").addClass("free");
            if (schedulerDebug) console.timeEnd("_initUI");
        },
        _FixTable: function () {
            var colWidth = 50;
            SchedulerTotalCells = SchedulerSlots.length;
            $('#' + schedulerTblId + ' thead tr th:eq(0)').css("width", schedulerTblFirstColWidth);
            //this get width might need fix depending on the template 
            var tblwidth = $('#scheduler-tab').parent().outerWidth();
            SchedulerTotalVisibleCells = parseInt((tblwidth - schedulerTblFirstColWidth) / colWidth);

            if (SchedulerData.length == 0) {
                //puth some test data
                SchedulerData.push({ name: 'xyz+aaa', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'xyz+aaa', type: 'node' });
                SchedulerData.push({ name: 'xyz+bbb', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'xyz+bbb', type: 'node' });
                SchedulerData.push({ name: 'xyz+ccc', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'xyz+ccc', type: 'node' });
                SchedulerData.push({ name: 'nitos1', leases: schedulerGetLeases(60 / schedulerSlotsPerHour), urn: 'nitos1', type: 'node' });
            }
            angular.element(document.getElementById('SchedulerCtrl')).scope().initSlots(0, SchedulerTotalVisibleCells);
        },
        _SetPeriodInPage: function (start, end) {
        }
    });

    //Sched2 = new Scheduler2();

    /* Plugin registration */
    $.plugin('Scheduler2', scheduler2);

    // TODO Here use cases for instanciating plugins in different ways like in the pastie.


})(jQuery);



