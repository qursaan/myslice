/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

(function($) {

    var debug=false;
    debug=true
    var contents_debug=false;
//    contents_debug=true;

    var QueryTable = Plugin.extend({

        init: function(options, element) {
            this._super(options, element);

            /* Member variables */
	    // in general we expect 2 queries here
	    // query_uuid refers to a single object (typically a slice)
	    // query_all_uuid refers to a list (typically resources or users)
	    // these can return in any order so we keep track of which has been received yet
            this.received_all_query = false;
            this.received_query = false;

//            // We need to remember the active filter for datatables filtering
//            this.filters = Array(); 

            // an internal buffer for records that are 'in' and thus need to be checked 
            this.buffered_records_to_check = [];

            /* XXX Events XXX */
            // this.$element.on('show.Datatables', this.on_show);
            this.elmt().on('show', this, this.on_show);
            // Unbind all events using namespacing
            // TODO in destructor
            // $(window).unbind('QueryTable');

            var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            this.method = query.object;

	    // xxx beware that this.key needs to contain a key that all records will have
	    // in general query_all will return well populated records, but query
	    // returns records with only the fields displayed on startup. 
	    this.key = (this.options.id_key);
	    if (! this.key) {
		// if not specified by caller, decide from metadata
		var keys = manifold.metadata.get_key(this.method);
		this.key = (keys && keys.length == 1) ? keys[0] : null;
	    }
	    if (! this.key) messages.warning("querytable.init could not kind valid key");

	    if (debug) messages.debug("querytable: key="+this.key);

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */
            this.initialize_table();
        },

        /* PLUGIN EVENTS */

        on_show: function(e) {
            var self = e.data;
            self.table.fnAdjustColumnSizing()
        }, // on_show

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        initialize_table: function() {
	    // compute columns based on columns and hidden_columns
	    this.slick_columns = [];
	    var all_columns = this.options.columns; // .concat(this.options.hidden_columns)
	    for (c in all_columns) {
		var column=all_columns[c];
		this.slick_columns.push ( {id:column, name:column, field:column });
	    }

	    // xxx should be extensible from caller with this.options.slickgrid_options 
	    this.slick_options = {
		enableCellNavigation: false,
		enableColumnReorder: true,
	    };

	    this.slick_data=[];
	    
	    var selector="#grid-"+this.options.domid;
	    if (contents_debug) {
		messages.debug("slick grid selector is " + selector);
		for (c in this.slick_columns) {
		    var col=this.slick_columns[c];
		    var msg="";
		    for (k in col) msg = msg+" col["+k+"]="+col[k];
		    messages.debug("slick_column["+c+"]:"+msg);
		}
	    }
	    // add a checkbox column
	    var checkbox_selector = new Slick.CheckboxSelectColumn({
		cssClass: "slick-cell-checkboxsel"
	    });
	    this.slick_columns.push(checkbox_selector.getColumnDefinition());
	    this.slick_grid = new Slick.Grid(selector, this.slick_data, this.slick_columns, this.slick_options);
	    this.slick_grid.setSelectionModel (new Slick.RowSelectionModel ({selectActiveRow: false}));
	    this.slick_grid.registerPlugin (checkbox_selector);
	    
	    this.columnpicker = new Slick.Controls.ColumnPicker (this.slick_columns, this.slick_grid, this.slick_options)

        }, // initialize_table

	// Determine index of key in the table columns 
        getColIndex: function(key, cols) {
            var tabIndex = $.map(cols, function(x, i) { if (x.sTitle == key) return i; });
            return (tabIndex.length > 0) ? tabIndex[0] : -1;
        }, // getColIndex

        checkbox_html : function (key, value) {
//	    if (debug) messages.debug("checkbox_html, value="+value);
            var result="";
            // Prefix id with plugin_uuid
            result += "<input";
            result += " class='querytable-checkbox'";
            result += " id='" + this.flat_id(this.id('checkbox', value)) + "'";
            result += " name='" + key + "'";
            result += " type='checkbox'";
            result += " autocomplete='off'";
	    if (value === undefined) {
		messages.warning("querytable.checkbox_html - undefined value");
	    } else {
		result += " value='" + value + "'";
	    }
            result += "></input>";
            return result;
        }, 

        new_record: function(record) {
	    this.slick_data.push(record);
        },

        clear_table: function() {
	    console.log("clear_table not implemented");
        },

        redraw_table: function() {
            this.table.fnDraw();
        },

        show_column: function(field) {
            var oSettings = this.table.fnSettings();
            var cols = oSettings.aoColumns;
            var index = this.getColIndex(field,cols);
            if (index != -1)
                this.table.fnSetColumnVis(index, true);
        },

        hide_column: function(field) {
	    console.log("hide_column not implemented - field="+field);
        },

        set_checkbox: function(record, checked) {
	    console.log("set_checkbox not implemented");
	    return;
            /* Default: checked = true */
            if (checked === undefined) checked = true;

            var id;
            /* The function accepts both records and their key */
            switch (manifold.get_type(record)) {
            case TYPE_VALUE:
                id = record;
                break;
            case TYPE_RECORD:
                /* XXX Test the key before ? */
                id = record[this.key];
                break;
            default:
                throw "Not implemented";
                break;
            }


	    if (id === undefined) {
		messages.warning("querytable.set_checkbox record has no id to figure which line to tick");
		return;
	    }
            var checkbox_id = this.flat_id(this.id('checkbox', id));
            // function escape_id(myid) is defined in portal/static/js/common.functions.js
            checkbox_id = escape_id(checkbox_id);
            // using dataTables's $ to search also in nodes that are not currently displayed
            var element = this.table.$(checkbox_id);
            if (debug) 
                messages.debug("set_checkbox checked=" + checked
                               + " id=" + checkbox_id + " matches=" + element.length);
            element.attr('checked', checked);
        },

        /*************************** QUERY HANDLER ****************************/

        on_filter_added: function(filter) {
            this.filters.push(filter);
            this.redraw_table();
        },

        on_filter_removed: function(filter) {
            // Remove corresponding filters
            this.filters = $.grep(this.filters, function(x) {
                return x != filter;
            });
            this.redraw_table();
        },
        
        on_filter_clear: function() {
            this.redraw_table();
        },

        on_field_added: function(field) {
            this.show_column(field);
        },

        on_field_removed: function(field) {
            this.hide_column(field);
        },

        on_field_clear: function() {
            alert('QueryTable::clear_fields() not implemented');
        },

        /* XXX TODO: make this generic a plugin has to subscribe to a set of Queries to avoid duplicated code ! */
        /*************************** ALL QUERY HANDLER ****************************/

        on_all_filter_added: function(filter) {
            // XXX
            this.redraw_table();
        },

        on_all_filter_removed: function(filter) {
            // XXX
            this.redraw_table();
        },
        
        on_all_filter_clear: function() {
            // XXX
            this.redraw_table();
        },

        on_all_field_added: function(field) {
            this.show_column(field);
        },

        on_all_field_removed: function(field) {
            this.hide_column(field);
        },

        on_all_field_clear: function() {
            alert('QueryTable::clear_fields() not implemented');
        },


        /*************************** RECORD HANDLER ***************************/

        on_new_record: function(record) {
            if (this.received_all_query) {
        	// if the 'all' query has been dealt with already we may turn on the checkbox
                this.set_checkbox(record, true);
            } else {
        	// otherwise we need to remember that and do it later on
        	if (debug) messages.debug("Remembering record to check " + record[this.key]);
                this.buffered_records_to_check.push(record);
            }
        },

        on_clear_records: function() {
        },

        // Could be the default in parent
        on_query_in_progress: function() {
            this.spin();
        },

        on_query_done: function() {
            this.received_query = true;
    	    // unspin once we have received both
            if (this.received_all_query && this.received_query) this.unspin();
        },
        
        on_field_state_changed: function(data) {
            switch(data.request) {
                case FIELD_REQUEST_ADD:
                case FIELD_REQUEST_ADD_RESET:
                    this.set_checkbox(data.value, true);
                    break;
                case FIELD_REQUEST_REMOVE:
                case FIELD_REQUEST_REMOVE_RESET:
                    this.set_checkbox(data.value, false);
                    break;
                default:
                    break;
            }
        },

        /* XXX TODO: make this generic a plugin has to subscribe to a set of Queries to avoid duplicated code ! */
        // all
        on_all_field_state_changed: function(data) {
            switch(data.request) {
                case FIELD_REQUEST_ADD:
                case FIELD_REQUEST_ADD_RESET:
                    this.set_checkbox(data.value, true);
                    break;
                case FIELD_REQUEST_REMOVE:
                case FIELD_REQUEST_REMOVE_RESET:
                    this.set_checkbox(data.value, false);
                    break;
                default:
                    break;
            }
        },

        on_all_new_record: function(record) {
            this.new_record(record);
        },

        on_all_clear_records: function() {
            this.clear_table();

        },

        on_all_query_in_progress: function() {
            // XXX parent
            this.spin();
        }, // on_all_query_in_progress

        on_all_query_done: function() {
	    if (debug) messages.debug("1-shot initializing dataTables content with " + this.slick_data.length + " lines");
	    var start=new Date();
	    this.slick_grid.setData (this.slick_data, true);
	    this.slick_grid.render();
	    var duration=new Date()-start;
	    if (debug) messages.debug("setData+render took " + duration + " ms");
	    if (contents_debug) {
		// show full contents of first row app
		for (k in this.slick_data[0]) messages.debug("slick_data[0]["+k+"]="+this.slick_data[0][k]);
	    }
	    
            var self = this;
	    // if we've already received the slice query, we have not been able to set 
	    // checkboxes on the fly at that time (dom not yet created)
            $.each(this.buffered_records_to_check, function(i, record) {
		if (debug) messages.debug ("delayed turning on checkbox " + i + " record= " + record);
                self.set_checkbox(record, true);
            });
	    this.buffered_records_to_check = [];

            this.received_all_query = true;
	    // unspin once we have received both
            if (this.received_all_query && this.received_query) this.unspin();

        }, // on_all_query_done

        /************************** PRIVATE METHODS ***************************/

        /** 
         * @brief QueryTable filtering function
         */
        _querytable_filter: function(oSettings, aData, iDataIndex) {
            var ret = true;
            $.each (this.filters, function(index, filter) { 
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
        },

        _querytable_draw_callback: function() {
            /* 
             * Handle clicks on checkboxes: reassociate checkbox click every time
             * the table is redrawn 
             */
            this.elts('querytable-checkbox').unbind('click').click(this, this._check_click);

            if (!this.table)
                return;

            /* Remove pagination if we show only a few results */
            var wrapper = this.table; //.parent().parent().parent();
            var rowsPerPage = this.table.fnSettings()._iDisplayLength;
            var rowsToShow = this.table.fnSettings().fnRecordsDisplay();
            var minRowsPerPage = this.table.fnSettings().aLengthMenu[0];

            if ( rowsToShow <= rowsPerPage || rowsPerPage == -1 ) {
                $('.querytable_paginate', wrapper).css('visibility', 'hidden');
            } else {
                $('.querytable_paginate', wrapper).css('visibility', 'visible');
            }

            if ( rowsToShow <= minRowsPerPage ) {
                $('.querytable_length', wrapper).css('visibility', 'hidden');
            } else {
                $('.querytable_length', wrapper).css('visibility', 'visible');
            }
        },

        _check_click: function(e) {
            e.stopPropagation();

            var self = e.data;

            // XXX this.value = key of object to be added... what about multiple keys ?
	    if (debug) messages.debug("querytable click handler checked=" + this.checked + " hrn=" + this.value);
            manifold.raise_event(self.options.query_uuid, this.checked?SET_ADD:SET_REMOVED, this.value);
            //return false; // prevent checkbox to be checked, waiting response from manifold plugin api
            
        },

        _selectAll: function() {
            // requires jQuery id
            var uuid=this.id.split("-");
            var oTable=$("#querytable-"+uuid[1]).dataTable();
            // Function available in QueryTable 1.9.x
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
        },

    });

    $.plugin('QueryTable', QueryTable);

//  /* define the 'dom-checkbox' type for sorting in datatables 
//     http://datatables.net/examples/plug-ins/dom_sort.html
//     using trial and error I found that the actual column number
//     was in fact given as a third argument, and not second 
//     as the various online resources had it - go figure */
//    $.fn.dataTableExt.afnSortData['dom-checkbox'] = function  ( oSettings, _, iColumn ) {
//	return $.map( oSettings.oApi._fnGetTrNodes(oSettings), function (tr, i) {
//	    return result=$('td:eq('+iColumn+') input', tr).prop('checked') ? '1' : '0';
//	} );
//    }

})(jQuery);

