/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */

// TEMP
var ELEMENT_KEY = 'resource_hrn';

(function($){

    var debug=false;
    debug=true

    // routing calls
    $.fn.Hazelnut = function( method ) {
        if ( methods[method] ) {
            return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.Hazelnut' );
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

            /* Default settings */
            var options = $.extend( {
                'checkboxes': false
            }, options);

            return this.each(function() {

                var $this = $(this);

                /* An object that will hold private variables and methods */
                var plugin = new Hazelnut (options);
                $this.data('Hazelnut', plugin);

                /* Events */
                $this.on('show.Datatables', methods.show);

                // This is the new plugin API meant to replace the weird publish_subscribe mechanism
                $this.set_query_handler(options.query_uuid, plugin.query_handler);
                $this.set_record_handler(options.query_uuid, plugin.record_handler); 
                $this.set_record_handler(options.query_all_uuid, plugin.record_handler_all); 

//                /* Subscriptions */
//                var query_channel   = '/query/' + options.query_uuid + '/changed';
//                var update_channel  = '/update-set/' + options.query_uuid;
//                var results_channel = '/results/' + options.query_uuid + '/changed';
//
//                // xxx not tested yet
//                $.subscribe(query_channel,  function(e, query) { hazelnut.set_query(query); });
//                // xxx not tested yet
//                $.subscribe(update_channel, function(e, resources, instance) { hazelnut.set_resources(resources, instance); });
//                // expected to work
//                $.subscribe(results_channel, $this, function(e, rows) { hazelnut.update_plugin(e,rows); });
//                if (debug)
//                    messages.debug("hazelnut '" + this.id + "' subscribed to e.g." + results_channel);

            }); // this.each
        }, // init

        /**
         * @brief Plugin destruction
         * @return : a jQuery collection of objects on which the plugin is
         *     applied, which allows to maintain chainability of calls
         */
        destroy : function( ) {

            return this.each(function() {
                var $this = $(this);
                var hazelnut = $this.data('Hazelnut');

                // Unbind all events using namespacing
                $(window).unbind('Hazelnut');

                // Remove associated data
                hazelnut.remove();
                $this.removeData('Hazelnut');
            });
        }, // destroy

        show : function( ) {
            var $this=$(this);
            // xxx wtf. why [1] ? would expect 0...
            if (debug)
                messages.debug("Hitting suspicious line in hazelnut.show");
            var oTable = $($('.dataTable', $this)[1]).dataTable();
            oTable.fnAdjustColumnSizing()
        
            /* Refresh dataTabeles if click on the menu to display it : fix dataTables 1.9.x Bug */        
            $(this).each(function(i,elt) {
                if (jQuery(elt).hasClass('dataTables')) {
                    var myDiv=jQuery('#hazelnut-' + this.id).parent();
                    if(myDiv.height()==0) {
                        var oTable=$('#hazelnut-' + this.id).dataTable();            
                        oTable.fnDraw();
                    }
                }
            });
        } // show

    }; // var methods;

    /***************************************************************************
     * Plugin object
     ***************************************************************************/

    function Hazelnut(options) 
    {
        /* member variables */
        this.options = options;

        // xxx thierry : initialize this here - it was not, I expect this relied on set_query somehow..
        //this.current_query = null;
        this.current_query=manifold.find_query(this.options.query_uuid);
        //  if (debug) messages.debug("Hazelnut constructor: have set current_query -> " + this.current_query.__repr());
        this.query_update = null;
        this.current_resources = Array();

        // query status
        this.received_all = false;
        this.received_set = false;
        this.in_set_buffer = Array();

        var object = this;

        this.initialize = function() {
            /* Transforms the table into DataTable, and keep a pointer to it */
            actual_options = {
                // Customize the position of Datatables elements (length,filter,button,...)
                // we use a fluid row on top and another on the bottom, making sure we take 12 grid elt's each time
                sDom: "<'row-fluid'<'span5'l><'span1'r><'span6'f>>t<'row-fluid'<'span5'i><'span7'p>>",
                sPaginationType: 'bootstrap',
                // Handle the null values & the error : Datatables warning Requested unknown parameter
                // http://datatables.net/forums/discussion/5331/datatables-warning-...-requested-unknown-parameter/p2
                aoColumnDefs: [{sDefaultContent: '',aTargets: [ '_all' ]}],
                // WARNING: this one causes tables in a 'tabs' that are not exposed at the time this is run to show up empty
                // sScrollX: '100%',       /* Horizontal scrolling */
                bProcessing: true,      /* Loading */
                fnDrawCallback: function() { hazelnut_draw_callback.call(object, options); }
            };
            // the intention here is that options.datatables_options as coming from the python object take precedence
            //  XXX DISABLED by jordan: was causing errors in datatables.js     $.extend(actual_options, options.datatables_options );
            this.table = $('#hazelnut-' + options.plugin_uuid).dataTable(actual_options);

            /* Setup the SelectAll button in the dataTable header */
            /* xxx not sure this is still working */
            var oSelectAll = $('#datatableSelectAll-'+ options.plugin_uuid);
            oSelectAll.html("<span class='ui-icon ui-icon-check' style='float:right;display:inline-block;'></span>Select All");
            oSelectAll.button();
            oSelectAll.css('font-size','11px');
            oSelectAll.css('float','right');
            oSelectAll.css('margin-right','15px');
            oSelectAll.css('margin-bottom','5px');
            oSelectAll.unbind('click');
            oSelectAll.click(selectAll);

            /* Add a filtering function to the current table 
             * Note: we use closure to get access to the 'options'
             */
            $.fn.dataTableExt.afnFiltering.push(function( oSettings, aData, iDataIndex ) { 
                /* No filtering if the table does not match */
                if (oSettings.nTable.id != "hazelnut-" + options.plugin_uuid)
                    return true;
                return hazelnut_filter.call(object, oSettings, aData, iDataIndex);
            });

            /* Processing hidden_columns */
            $.each(options.hidden_columns, function(i, field) {
                object.hide_column(field);
            });
        }

        /* methods */

// DEPRECATED //        this.set_query = function(query) {
// DEPRECATED //            messages.info('hazelnut.set_query');
// DEPRECATED //            var options = this.options;
// DEPRECATED //            /* Compare current and advertised query to get added and removed fields */
// DEPRECATED //            previous_query = this.current_query;
// DEPRECATED //            /* Save the query as the current query */
// DEPRECATED //            this.current_query = query;
// DEPRECATED //            if (debug)
// DEPRECATED //                messages.debug("hazelnut.set_query, current_query is now -> " + this.current_query);
// DEPRECATED //
// DEPRECATED //            /* We check all necessary fields : in column editor I presume XXX */
// DEPRECATED //            // XXX ID naming has no plugin_uuid
// DEPRECATED //            if (typeof(query.fields) != 'undefined') {        
// DEPRECATED //                $.each (query.fields, function(index, value) { 
// DEPRECATED //                    if (!$('#hazelnut-checkbox-' + options.plugin_uuid + "-" + value).attr('checked'))
// DEPRECATED //                        $('#hazelnut-checkbox-' + options.plugin_uuid + "-" + value).attr('checked', true);
// DEPRECATED //                });
// DEPRECATED //            }
// DEPRECATED //
// DEPRECATED //            /* Process updates in filters / current_query must be updated before this call for filtering ! */
// DEPRECATED //            this.table.fnDraw();
// DEPRECATED //
// DEPRECATED //            /*
// DEPRECATED //             * Process updates in fields
// DEPRECATED //             */
// DEPRECATED //            if (typeof(query.fields) != 'undefined') {     
// DEPRECATED //                /* DataTable Settings */
// DEPRECATED //                var oSettings = this.table.dataTable().fnSettings();
// DEPRECATED //                var cols = oSettings.aoColumns;
// DEPRECATED //                var colnames = cols.map(function(x) {return x.sTitle});
// DEPRECATED //                colnames = $.grep(colnames, function(value) {return value != "+/-";});
// DEPRECATED //
// DEPRECATED //                if (previous_query == null) {
// DEPRECATED //                    var added_fields = query.fields;
// DEPRECATED //                    var removed_fields = colnames;            
// DEPRECATED //                    removed_fields = $.grep(colnames, function(x) { return $.inArray(x, added_fields) == -1});
// DEPRECATED //                } else {
// DEPRECATED //                    var tmp = previous_query.diff_fields(query);
// DEPRECATED //                    var added_fields = tmp.added;
// DEPRECATED //                    var removed_fields = tmp.removed;
// DEPRECATED //                }
// DEPRECATED //
// DEPRECATED //                /* Hide/unhide columns to match added/removed fields */
// DEPRECATED //                var object = this;
// DEPRECATED //                $.each(added_fields, function (index, field) {            
// DEPRECATED //                    var index = object.getColIndex(field,cols);
// DEPRECATED //                    if(index != -1)
// DEPRECATED //                        object.table.fnSetColumnVis(index, true);
// DEPRECATED //                });
// DEPRECATED //                $.each(removed_fields, function (index, field) {
// DEPRECATED //                    var index = object.getColIndex(field,cols);
// DEPRECATED //                    if(index != -1)
// DEPRECATED //                        object.table.fnSetColumnVis(index, false);
// DEPRECATED //                });            
// DEPRECATED //            }
// DEPRECATED //        }

// DEPRECATED //        this.set_resources = function(resources, instance) {
// DEPRECATED //            if (debug)
// DEPRECATED //                messages.debug("entering hazelnut.set_resources");
// DEPRECATED //            var options = this.options;
// DEPRECATED //            var previous_resources = this.current_resources;
// DEPRECATED //            this.current_resources = resources;
// DEPRECATED //    
// DEPRECATED //            /* We uncheck all checkboxes ... */
// DEPRECATED //            $('hazelnut-checkbox-' + options.plugin_uuid).attr('checked', false);
// DEPRECATED //            /* ... and check the ones specified in the resource list */
// DEPRECATED //            $.each(this.current_resources, function(index, urn) {
// DEPRECATED //                $('#hazelnut-checkbox-' + options.plugin_uuid + "-" + urn).attr('checked', true)
// DEPRECATED //            });
// DEPRECATED //            
// DEPRECATED //        }

        /**
         * @brief Determine index of key in the table columns 
         * @param key
         * @param cols
         */
        this.getColIndex = function(key, cols) {
            var tabIndex = $.map(cols, function(x, i) { if (x.sTitle == key) return i; });
            return (tabIndex.length > 0) ? tabIndex[0] : -1;
        };
    
// DEPRECATED //        /**
// DEPRECATED //         * @brief
// DEPRECATED //         * XXX will be removed/replaced
// DEPRECATED //         */
// DEPRECATED //        this.selected_changed = function(e, change) {
// DEPRECATED //        if (debug) messages.debug("entering hazelnut.selected_changed");
// DEPRECATED //            var actions = change.split("/");
// DEPRECATED //            if (actions.length > 1) {
// DEPRECATED //                var oNodes = this.table.fnGetNodes();
// DEPRECATED //                var myNode = $.grep(oNodes, function(value) {
// DEPRECATED //                    if (value.id == actions[1]) { return value; }
// DEPRECATED //                });                
// DEPRECATED //                if( myNode.length>0 ) {
// DEPRECATED //                    if ((actions[2]=="add" && actions[0]=="cancel") || actions[0]=="del")
// DEPRECATED //                        checked='';
// DEPRECATED //                    else
// DEPRECATED //                        checked="checked='checked' ";
// DEPRECATED //                    var newValue = this.checkbox(actions[1], 'node', checked, false);
// DEPRECATED //                    var columnPos = this.table.fnSettings().aoColumns.length - 1;
// DEPRECATED //                    this.table.fnUpdate(newValue, myNode[0], columnPos);
// DEPRECATED //                    this.table.fnDraw();
// DEPRECATED //                }
// DEPRECATED //            }
// DEPRECATED //        }
    
        this.update_plugin = function(e, rows) {
            // e.data is what we passed in second argument to subscribe
            // so here it is the jquery object attached to the plugin <div>
            var $plugindiv=e.data;
            if (debug)
                messages.debug("entering hazelnut.update_plugin on id '" + $plugindiv.attr('id') + "'");
            // clear the spinning wheel: look up an ancestor that has the need-spin class
            // do this before we might return
            $plugindiv.closest('.need-spin').spin(false);

            var options = this.options;
            var hazelnut = this;
    
            /* if we get no result, or an error, try to make that clear, and exit */
            if (rows.length==0) {
                if (debug) 
                    messages.debug("Empty result on hazelnut " + this.options.domid);
                var placeholder=$(this.table).find("td.dataTables_empty");
                console.log("placeholder "+placeholder);
                if (placeholder.length==1) 
                    placeholder.html(unfold.warning("Empty result"));
                else
                    this.table.html(unfold.warning("Empty result"));
                    return;
            } else if (typeof(rows[0].error) != 'undefined') {
                // we now should have another means to report errors that this inline/embedded hack
                if (debug) 
                    messages.error ("undefined result on " + this.options.domid + " - should not happen anymore");
                this.table.html(unfold.error(rows[0].error));
                return;
            }

            /* 
             * fill the dataTables object
             * we cannot set html content directly here, need to use fnAddData
             */
            var lines = new Array();
    
            this.current_resources = Array();
    
            $.each(rows, function(index, row) {
                // this models a line in dataTables, each element in the line describes a cell
                line = new Array();
     
                // go through table headers to get column names we want
                // in order (we have temporarily hack some adjustments in names)
                var cols = object.table.fnSettings().aoColumns;
                var colnames = cols.map(function(x) {return x.sTitle})
                var nb_col = cols.length;
                /* if we've requested checkboxes, then forget about the checkbox column for now */
                if (options.checkboxes) nb_col -= 1;

                /* fill in stuff depending on the column name */
                for (var j = 0; j < nb_col; j++) {
                    if (typeof colnames[j] == 'undefined') {
                        line.push('...');
                    } else if (colnames[j] == 'hostname') {
                        if (row['type'] == 'resource,link')
                            //TODO: we need to add source/destination for links
                            line.push('');
                        else
                            line.push(row['hostname']);
                    } else {
                        if (row[colnames[j]])
                            line.push(row[colnames[j]]);
                        else
                            line.push('');
                    }
                }
    
                /* catch up with the last column if checkboxes were requested */
                if (options.checkboxes) {
                    var checked = '';
                    // xxx problem is, we don't get this 'sliver' thing set apparently
                    if (typeof(row['sliver']) != 'undefined') { /* It is equal to null when <sliver/> is present */
                        checked = 'checked ';
                        hazelnut.current_resources.push(row[ELEMENT_KEY]);
                    }
                    // Use a key instead of hostname (hard coded...)
                    line.push(hazelnut.checkbox(options.plugin_uuid, row[ELEMENT_KEY], row['type'], checked, false));
                }
    
                lines.push(line);
    
            });
    
            this.table.fnClearTable();
            if (debug)
                messages.debug("hazelnut.update_plugin: total of " + lines.length + " rows");
            this.table.fnAddData(lines);
        
        };

        this.checkbox = function (plugin_uuid, header, field, selected_str, disabled_str)
        {
            var result="";
            if (header === null)
                header = '';
            // Prefix id with plugin_uuid
            result += "<input";
            result += " class='hazelnut-checkbox-" + plugin_uuid + "'";
            result += " id='hazelnut-checkbox-" + plugin_uuid + "-" + unfold.get_value(header).replace(/\\/g, '')  + "'";
            result += " name='" + unfold.get_value(field) + "'";
            result += " type='checkbox'";
            result += selected_str;
            result += disabled_str;
            result += " autocomplete='off'";
            result += " value='" + unfold.get_value(header) + "'";
            result += "></input>";
            return result;
        };

        ////////////////////////////////////////////////////////////////////////
        // New plugin API (in tests)

        // TODO : signal empty/non empty table

        this.new_record = function(record)
        {
            // this models a line in dataTables, each element in the line describes a cell
            line = new Array();
     
            // go through table headers to get column names we want
            // in order (we have temporarily hack some adjustments in names)
            var cols = object.table.fnSettings().aoColumns;
            var colnames = cols.map(function(x) {return x.sTitle})
            var nb_col = cols.length;
            /* if we've requested checkboxes, then forget about the checkbox column for now */
            if (options.checkboxes) nb_col -= 1;

            /* fill in stuff depending on the column name */
            for (var j = 0; j < nb_col; j++) {
                if (typeof colnames[j] == 'undefined') {
                    line.push('...');
                } else if (colnames[j] == 'hostname') {
                    if (record['type'] == 'resource,link')
                        //TODO: we need to add source/destination for links
                        line.push('');
                    else
                        line.push(record['hostname']);
                } else {
                    if (record[colnames[j]])
                        line.push(record[colnames[j]]);
                    else
                        line.push('');
                }
            }
    
            /* catch up with the last column if checkboxes were requested */
            if (options.checkboxes) {
                var checked = '';
                // xxx problem is, we don't get this 'sliver' thing set apparently
                if (typeof(record['sliver']) != 'undefined') { /* It is equal to null when <sliver/> is present */
                    checked = 'checked ';
                    hazelnut.current_resources.push(record[ELEMENT_KEY]);
                }
                // Use a key instead of hostname (hard coded...)
                line.push(object.checkbox(options.plugin_uuid, record[ELEMENT_KEY], record['type'], checked, false));
            }
    
            // XXX Is adding an array of lines more efficient ?
            this.table.fnAddData(line);

        };

        this.set_checkbox = function(record)
        {
            // XXX urn should be replaced by the key
            // XXX we should enforce that both queries have the same key !!
            checkbox_id = "#hazelnut-checkbox-" + object.options.plugin_uuid + "-" + unfold.escape_id(record[ELEMENT_KEY].replace(/\\/g, ''))
            $(checkbox_id, object.table.fnGetNodes()).attr('checked', true);
        }

        this.record_handler = function(e, event_type, record)
        {
            // elements in set
            switch(event_type) {
                case NEW_RECORD:
                    /* NOTE in fact we are doing a join here */
                    if (object.received_all)
                        // update checkbox for record
                        object.set_checkbox(record);
                    else
                        // store for later update of checkboxes
                        object.in_set_buffer.push(record);
                    break;
                case CLEAR_RECORDS:
                    // nothing to do here
                    break;
                case IN_PROGRESS:
                    manifold.spin($(this));
                    break;
                case DONE:
                    if (object.received_all)
                        manifold.spin($(this), false);
                    object.received_set = true;
                    break;
            }
        };

        this.record_handler_all = function(e, event_type, record)
        {
            // all elements
            switch(event_type) {
                case NEW_RECORD:
                    // Add the record to the table
                    object.new_record(record);
                    break;
                case CLEAR_RECORDS:
                    object.table.fnClearTable();
                    break;
                case IN_PROGRESS:
                    manifold.spin($(this));
                    break;
                case DONE:
                    if (object.received_set) {
                        /* XXX needed ? XXX We uncheck all checkboxes ... */
                        $("[id^='datatables-checkbox-" + object.options.plugin_uuid +"']").attr('checked', false);

                        /* ... and check the ones specified in the resource list */
                        $.each(object.in_set_buffer, function(i, record) {
                            object.set_checkbox(record);
                        });

                        manifold.spin($(this), false);
                    }
                    object.received_all = true;
                    break;
            }
        };

        this.show_column = function(field)
        {
            var oSettings = object.table.fnSettings();
            var cols = oSettings.aoColumns;
            var index = object.getColIndex(field,cols);
            if (index != -1)
                object.table.fnSetColumnVis(index, true);
        }

        this.hide_column = function(field)
        {
            var oSettings = object.table.fnSettings();
            var cols = oSettings.aoColumns;
            var index = object.getColIndex(field,cols);
            if (index != -1)
                object.table.fnSetColumnVis(index, false);
        }

        this.query_handler = function(e, event_type, data)
        {
            // This replaces the complex set_query function
            // The plugin does not need to remember the query anymore
            switch(event_type) {
                // Filters
                case FILTER_ADDED:
                case FILTER_REMOVED:
                case CLEAR_FILTERS:
                    // XXX Here we might need to maintain the list of filters !
                    /* Process updates in filters / current_query must be updated before this call for filtering ! */
                    object.table.fnDraw();
                    break;

                // Fields
                /* Hide/unhide columns to match added/removed fields */
                case FIELD_ADDED:
                    object.show_column(data);
                    break;
                case FIELD_REMOVED:
                    object.hide_column(data);
                    break;
                case CLEAR_FIELDS:
                    alert('Hazelnut::clear_fields() not implemented');
                    break;
            } // switch


        }

        // Constructor
        object.initialize();

    } // constructor

    /***************************************************************************
     * Private methods
     * xxx I'm not sure why this should not be methods in the Hazelnut class above
     ***************************************************************************/

    /** 
     * @brief Hazelnut filtering function
     */
    function hazelnut_filter (oSettings, aData, iDataIndex) {
        var cur_query = this.current_query;
        if (!cur_query) return true;
        var ret = true;

        /* We have an array of filters : a filter is an array (key op val) 
         * field names (unless shortcut)    : oSettings.aoColumns  = [ sTitle ]
         *     can we exploit the data property somewhere ?
         * field values (unless formatting) : aData
         *     formatting should leave original data available in a hidden field
         *
         * The current line should validate all filters
         */
        $.each (cur_query.filters, function(index, filter) { 
            /* XXX How to manage checkbox ? */
            var key = filter[0]; 
            var op = filter[1];
            var value = filter[2];

            /* Determine index of key in the table columns */
            var col = $.map(oSettings.aoColumns, function(x, i) {if (x.sTitle == key) return i;})[0];

            /* Unknown key: no filtering */
            if (typeof(col) == 'undefined')
                return;

            col_value=unfold.get_value(aData[col]);
            /* Test whether current filter is compatible with the column */
            if (op == '=' || op == '==') {
                if ( col_value != value || col_value==null || col_value=="" || col_value=="n/a")
                    ret = false;
            }else if (op == '!=') {
                if ( col_value == value || col_value==null || col_value=="" || col_value=="n/a")
                    ret = false;
            } else if(op=='<') {
                if ( parseFloat(col_value) >= value || col_value==null || col_value=="" || col_value=="n/a")
                    ret = false;
            } else if(op=='>') {
                if ( parseFloat(col_value) <= value || col_value==null || col_value=="" || col_value=="n/a")
                    ret = false;
            } else if(op=='<=' || op=='≤') {
                if ( parseFloat(col_value) > value || col_value==null || col_value=="" || col_value=="n/a")
                    ret = false;
            } else if(op=='>=' || op=='≥') {
                if ( parseFloat(col_value) < value || col_value==null || col_value=="" || col_value=="n/a")
                    ret = false;
            }else{
                // How to break out of a loop ?
                alert("filter not supported");
                return false;
            }

        });
        return ret;
    }

    function hazelnut_draw_callback() {
        var options = this.options;
        /* 
         * Handle clicks on checkboxes: reassociate checkbox click every time
         * the table is redrawn 
         */
        $('.hazelnut-checkbox-' + options.plugin_uuid).unbind('click');
        $('.hazelnut-checkbox-' + options.plugin_uuid).click({instance: this}, check_click);

        if (!this.table)
            return;

        /* Remove pagination if we show only a few results */
        var wrapper = this.table; //.parent().parent().parent();
        var rowsPerPage = this.table.fnSettings()._iDisplayLength;
        var rowsToShow = this.table.fnSettings().fnRecordsDisplay();
        var minRowsPerPage = this.table.fnSettings().aLengthMenu[0];

        if ( rowsToShow <= rowsPerPage || rowsPerPage == -1 ) {
            $('.hazelnut_paginate', wrapper).css('visibility', 'hidden');
        } else {
            $('.hazelnut_paginate', wrapper).css('visibility', 'visible');
        }

        if ( rowsToShow <= minRowsPerPage ) {
            $('.hazelnut_length', wrapper).css('visibility', 'hidden');
        } else {
            $('.hazelnut_length', wrapper).css('visibility', 'visible');
        }
    }

    function check_click (e) {

        var object = e.data.instance;

        /* The key of the object to be added */
        // XXX What about multiple keys ?
        var value = this.value; 

        // NEW PLUGIN API
        manifold.raise_event(object.options.query_uuid, this.checked?SET_ADD:SET_REMOVED, value);
        
        // OLD PLUGIN API BELOW

        if (this.checked) {
            object.current_resources.push(value);
        } else {
            tmp = $.grep(object.current_resources, function(x) { return x != value; });
            object.current_resources = tmp;
        }

        /* inform slice that our selected resources have changed */
        $.publish('/update-set/' + object.options.query_uuid, [object.current_resources, true]);

    }

    function selectAll() {
        // requires jQuery id
        var uuid=this.id.split("-");
        var oTable=$("#hazelnut-"+uuid[1]).dataTable();
        // Function available in Hazelnut 1.9.x
        // Filter : displayed data only
        var filterData = oTable._('tr', {"filter":"applied"});   
        /* TODO: WARNING if too many nodes selected, use filters to reduce nuber of nodes */        
        if(filterData.length<=100){
            $.each(filterData, function(index, obj) {
                var last=$(obj).last();
                var key_value=unfold.get_value(last[0]);
                if(typeof($(last[0]).attr('checked'))=="undefined"){
                    $.publish('selected', 'add/'+key_value);
                }
            });
        }
    }
    
})( jQuery );
