/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

(function($){

    var debug=false;
//    debug=true

    var Hazelnut = Plugin.extend({

        init: function(options, element) 
        {
            this._super(options, element);

            /* Member variables */
	    // in general we expect 2 queries here
	    // query_uuid refers to a single object (typically a slice)
	    // query_all_uuid refers to a list (typically resources or users)
	    // these can return in any order so we keep track of which has been received yet
            this.received_all_query = false;
            this.received_query = false;

            // an internal buffer for records that are 'in' and thus need to be checked 
            this.buffered_records_to_check = [];
	    // an internal buffer for keeping lines and display them in one call to fnAddData
	    this.buffered_lines = [];

            /* XXX Events XXX */
            // this.$element.on('show.Datatables', this.on_show);
            this.elmt().on('show', this, this.on_show);
            // Unbind all events using namespacing
            // TODO in destructor
            // $(window).unbind('Hazelnut');

            var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            this.method = query.object;

            var keys = manifold.metadata.get_key(this.method);
            this.key = (keys && keys.length == 1) ? keys[0] : null;

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */
            this.initialize_table();
        },

        /* PLUGIN EVENTS */

        on_show: function(e)
        {
            var self = e.data;

            self.table.fnAdjustColumnSizing()
        
            /* Refresh dataTabeles if click on the menu to display it : fix dataTables 1.9.x Bug */        
            /* temp disabled... useful ? -- jordan
            $(this).each(function(i,elt) {
                if (jQuery(elt).hasClass('dataTables')) {
                    var myDiv=jQuery('#hazelnut-' + this.id).parent();
                    if(myDiv.height()==0) {
                        var oTable=$('#hazelnut-' + this.id).dataTable();            
                        oTable.fnDraw();
                    }
                }
            });
            */
        }, // on_show

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        initialize_table: function() 
        {
            /* Transforms the table into DataTable, and keep a pointer to it */
            var self = this;
            var actual_options = {
                // Customize the position of Datatables elements (length,filter,button,...)
                // we use a fluid row on top and another on the bottom, making sure we take 12 grid elt's each time
                sDom: "<'row'<'col-xs-5'l><'col-xs-1'r><'col-xs-6'f>>t<'row'<'col-xs-5'i><'col-xs-7'p>>",
		// XXX as of sept. 2013, I cannot locate a bootstrap3-friendly mode for now
		// hopefully this would come with dataTables v1.10 ?
		// in any case, search for 'sPaginationType' all over the code for more comments
                sPaginationType: 'bootstrap',
                // Handle the null values & the error : Datatables warning Requested unknown parameter
                // http://datatables.net/forums/discussion/5331/datatables-warning-...-requested-unknown-parameter/p2
                aoColumnDefs: [{sDefaultContent: '',aTargets: [ '_all' ]}],
                // WARNING: this one causes tables in a 'tabs' that are not exposed at the time this is run to show up empty
                // sScrollX: '100%',       /* Horizontal scrolling */
                bProcessing: true,      /* Loading */
                fnDrawCallback: function() { self._hazelnut_draw_callback.call(self); }
                // XXX use $.proxy here !
            };
            // the intention here is that options.datatables_options as coming from the python object take precedence
	    // xxx DISABLED by jordan: was causing errors in datatables.js
	    // xxx turned back on by Thierry - this is the code that takes python-provided options into account
	    // check your datatables_options tag instead 
	    // however, we have to accumulate in aoColumnDefs from here (above) 
	    // and from the python wrapper (checkboxes management, plus any user-provided aoColumnDefs)
	    if ( 'aoColumnDefs' in this.options.datatables_options) {
		actual_options['aoColumnDefs']=this.options.datatables_options['aoColumnDefs'].concat(actual_options['aoColumnDefs']);
		delete this.options.datatables_options['aoColumnDefs'];
	    }
	    $.extend(actual_options, this.options.datatables_options );
            this.table = this.elmt('table').dataTable(actual_options);

            /* Setup the SelectAll button in the dataTable header */
            /* xxx not sure this is still working */
            var oSelectAll = $('#datatableSelectAll-'+ this.options.plugin_uuid);
            oSelectAll.html("<span class='ui-icon ui-icon-check' style='float:right;display:inline-block;'></span>Select All");
            oSelectAll.button();
            oSelectAll.css('font-size','11px');
            oSelectAll.css('float','right');
            oSelectAll.css('margin-right','15px');
            oSelectAll.css('margin-bottom','5px');
            oSelectAll.unbind('click');
            oSelectAll.click(this._selectAll);

            /* Add a filtering function to the current table 
             * Note: we use closure to get access to the 'options'
             */
            $.fn.dataTableExt.afnFiltering.push(function( oSettings, aData, iDataIndex ) { 
                /* No filtering if the table does not match */
                if (oSettings.nTable.id != "hazelnut-" + self.options.plugin_uuid)
                    return true;
                return this._hazelnut_filter.call(self, oSettings, aData, iDataIndex);
            });

            /* Processing hidden_columns */
            $.each(this.options.hidden_columns, function(i, field) {
                self.hide_column(field);
            });
        }, // initialize_table

        /**
         * @brief Determine index of key in the table columns 
         * @param key
         * @param cols
         */
        getColIndex: function(key, cols) {
            var tabIndex = $.map(cols, function(x, i) { if (x.sTitle == key) return i; });
            return (tabIndex.length > 0) ? tabIndex[0] : -1;
        }, // getColIndex

        checkbox_html : function (key, value)
        {
            var result="";
            // Prefix id with plugin_uuid
            result += "<input";
            result += " class='hazelnut-checkbox'";
            result += " id='" + this.flat_id(this.id('checkbox', value)) + "'";
            result += " name='" + key + "'";
            result += " type='checkbox'";
            result += " autocomplete='off'";
            result += " value='" + value + "'";
            result += "></input>";
            return result;
        }, // checkbox


        new_record: function(record)
        {
            // this models a line in dataTables, each element in the line describes a cell
            line = new Array();
     
            // go through table headers to get column names we want
            // in order (we have temporarily hack some adjustments in names)
            var cols = this.table.fnSettings().aoColumns;
            var colnames = cols.map(function(x) {return x.sTitle})
            var nb_col = cols.length;
            /* if we've requested checkboxes, then forget about the checkbox column for now */
            if (this.options.checkboxes) nb_col -= 1;

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
    
            // catch up with the last column if checkboxes were requested 
            if (this.options.checkboxes) {
                // Use a key instead of hostname (hard coded...)
                line.push(this.checkbox_html(this.key, record[this.key]));
	    }
    
	    // adding an array in one call is *much* more efficient
	    // this.table.fnAddData(line);
	    this.buffered_lines.push(line);

        },

        clear_table: function()
        {
            this.table.fnClearTable();
        },

        redraw_table: function()
        {
            this.table.fnDraw();
        },

        show_column: function(field)
        {
            var oSettings = this.table.fnSettings();
            var cols = oSettings.aoColumns;
            var index = this.getColIndex(field,cols);
            if (index != -1)
                this.table.fnSetColumnVis(index, true);
        },

        hide_column: function(field)
        {
            var oSettings = this.table.fnSettings();
            var cols = oSettings.aoColumns;
            var index = this.getColIndex(field,cols);
            if (index != -1)
                this.table.fnSetColumnVis(index, false);
        },

        set_checkbox: function(record, checked)
        {
            /* Default: checked = true */
            if (checked === undefined) checked = true;

            var key_value;
            /* The function accepts both records and their key */
            switch (manifold.get_type(record)) {
                case TYPE_VALUE:
                    key_value = record;
                    break;
                case TYPE_RECORD:
                    /* XXX Test the key before ? */
                    key_value = record[this.key];
                    break;
                default:
                    throw "Not implemented";
                    break;
            }


            var checkbox_id = this.flat_id(this.id('checkbox', key_value));
            checkbox_id = '#' + checkbox_id;
	    // using dataTables's $ to search also in nodes that are not currently displayed
            var element = this.table.$(checkbox_id);
	    if (debug) messages.debug("set_checkbox checked=" + checked + " id=" + checkbox_id + " matches=" + element.length);
            element.attr('checked', checked);
        },

        /*************************** QUERY HANDLER ****************************/

        on_filter_added: function(filter)
        {
            // XXX
            this.redraw_table();
        },

        on_filter_removed: function(filter)
        {
            // XXX
            this.redraw_table();
        },
        
        on_filter_clear: function()
        {
            // XXX
            this.redraw_table();
        },

        on_field_added: function(field)
        {
            this.show_column(field);
        },

        on_field_removed: function(field)
        {
            this.hide_column(field);
        },

        on_field_clear: function()
        {
            alert('Hazelnut::clear_fields() not implemented');
        },

        /*************************** RECORD HANDLER ***************************/

        on_new_record: function(record)
        {
            if (this.received_all_query) {
		// if the 'all' query has been dealt with already we may turn on the checkbox
		if (debug) messages.debug("turning on checkbox for record "+record[this.key]);
                this.set_checkbox(record, true);
	    } else {
		// otherwise we need to remember that and do it later on
		if (debug) messages.debug ("Remembering record to check " + record[this.key]);
                this.buffered_records_to_check.push(record);
	    }
        },

        on_clear_records: function()
        {
        },

        // Could be the default in parent
        on_query_in_progress: function()
        {
            this.spin();
        },

        on_query_done: function()
        {
            this.received_query = true;
	    // unspin once we have received both
            if (this.received_all_query && this.received_query) this.unspin();
        },
        
        on_field_state_changed: function(data)
        {
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

        // all

        on_all_new_record: function(record)
        {
            this.new_record(record);
        },

        on_all_clear_records: function()
        {
            this.clear_table();

        },

        on_all_query_in_progress: function()
        {
            // XXX parent
            this.spin();
        }, // on_all_query_in_progress

        on_all_query_done: function()
        {
	    if (debug) messages.debug("1-shot initializing dataTables content with " + this.buffered_lines.length + " lines");
	    this.table.fnAddData (this.buffered_lines);
	    this.buffered_lines=[];
	    
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
         * @brief Hazelnut filtering function
         */
        _hazelnut_filter: function(oSettings, aData, iDataIndex)
        {
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
        },

        _hazelnut_draw_callback: function()
        {
            /* 
             * Handle clicks on checkboxes: reassociate checkbox click every time
             * the table is redrawn 
             */
            this.elts('hazelnut-checkbox').unbind('click').click(this, this._check_click);

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
        },

        _check_click: function(e) 
        {
            e.stopPropagation();

            var self = e.data;

            // XXX this.value = key of object to be added... what about multiple keys ?
	    if (debug) messages.debug("hazelnut click handler checked=" + this.checked + " hrn=" + this.value);
            manifold.raise_event(self.options.query_uuid, this.checked?SET_ADD:SET_REMOVED, this.value);
            //return false; // prevent checkbox to be checked, waiting response from manifold plugin api
            
        },

        _selectAll: function() 
        {
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
        },

    });

    $.plugin('Hazelnut', Hazelnut);

  /* define the 'dom-checkbox' type for sorting in datatables 
     http://datatables.net/examples/plug-ins/dom_sort.html
     using trial and error I found that the actual column number
     was in fact given as a third argument, and not second 
     as the various online resources had it - go figure */
    $.fn.dataTableExt.afnSortData['dom-checkbox'] = function  ( oSettings, _, iColumn ) {
	return $.map( oSettings.oApi._fnGetTrNodes(oSettings), function (tr, i) {
	    return result=$('td:eq('+iColumn+') input', tr).prop('checked') ? '1' : '0';
	} );
    }

})(jQuery);

