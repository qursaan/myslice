/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

QUERYTABLE_BGCOLOR_RESET   = 0;
QUERYTABLE_BGCOLOR_ADDED   = 1;
QUERYTABLE_BGCOLOR_REMOVED = 2;

(function($){

    
    var QUERYTABLE_MAP = {
        'Facility': 'facility_name',
        'Testbed': 'testbed_name',
        'Resource name': 'hostname',
        'Type': 'type',
    };

    var debug=false;
//    debug=true

    var QueryTable = Plugin.extend({

        init: function(options, element) {
        this.classname="querytable";
            this._super(options, element);

            /* Member variables */
            var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            this.object = query.object; // XXX

            /* Events */
            this.elmt().on('show', this, this.on_show);
            this.elmt().on('shown.bs.tab', this, this.on_show);
            this.elmt().on('resize', this, this.on_resize);

            //// we need 2 different keys
            // * canonical_key is the primary key as derived from metadata (typically: urn)
            //   and is used to communicate about a given record with the other plugins
            // * init_key is a key that both kinds of records 
            //   (i.e. records returned by both queries) must have (typically: hrn or hostname)
            //   in general query_all will return well populated records, but query
            //   returns records with only the fields displayed on startup
            var keys = manifold.metadata.get_key(this.object);
            this.canonical_key = (keys && keys.length == 1) ? keys[0] : undefined;
            // 
            this.init_key = this.options.init_key;
            // have init_key default to canonical_key
            this.init_key = this.init_key || this.canonical_key;

            /* sanity check */
            if ( ! this.init_key ) 
                messages.warning ("QueryTable : cannot find init_key");
            if ( ! this.canonical_key ) 
                messages.warning ("QueryTable : cannot find canonical_key");
            if (debug)
                messages.debug("querytable: canonical_key="+this.canonical_key+" init_key="+this.init_key);

            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);

            /* GUI setup and event binding */
            this.initialize_table();
        },

        /* PLUGIN EVENTS */

        on_show: function(e) {
        if (debug) messages.debug("querytable.on_show");
            var self = e.data;
            self.table.fnAdjustColumnSizing();
    },        

        on_resize: function(e) {
        if (debug) messages.debug("querytable.on_resize");
            var self = e.data;
            self.table.fnAdjustColumnSizing();
    },        

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        initialize_table: function() 
        {
            /* Transforms the table into DataTable, and keep a pointer to it */
            var self = this;
            var actual_options = {
                // Customize the position of Datatables elements (length,filter,button,...)
                // we use a fluid row on top and another on the bottom, making sure we take 12 grid elt's each time
                //sDom: "<'row'<'col-xs-5'l><'col-xs-1'r><'col-xs-6'f>>t<'row'<'col-xs-5'i><'col-xs-7'p>>",
                sDom: "<'row'<'col-xs-5'f><'col-xs-1'r><'col-xs-6 columns_selector'>>t<'row'<'col-xs-5'l><'col-xs-7'p>>",
        // XXX as of sept. 2013, I cannot locate a bootstrap3-friendly mode for now
        // hopefully this would come with dataTables v1.10 ?
        // in any case, search for 'sPaginationType' all over the code for more comments
                sPaginationType: 'bootstrap',
                // Handle the null values & the error : Datatables warning Requested unknown parameter
                // http://datatables.net/forums/discussion/5331/datatables-warning-...-requested-unknown-parameter/p2
                aoColumnDefs: [{sDefaultContent: '', aTargets: [ '_all' ]}],
                // WARNING: this one causes tables in a 'tabs' that are not exposed at the time this is run to show up empty
                // sScrollX: '100%',       /* Horizontal scrolling */
                bProcessing: true,      /* Loading */
                fnDrawCallback: function() { self._querytable_draw_callback.call(self); },
                fnRowCallback: function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                    // This function is called on fnAddData to set the TR id. What about fnUpdate ?

                    // Get the key from the raw data array aData
                    var key = self.canonical_key;

                    // Get the index of the key in the columns
                    var cols = self._get_columns();
                    var index = self.getColIndex(key, cols);
                    if (index != -1) {
                        // The key is found in the table, set the TR id after the data
                        $(nRow).attr('id', self.id_from_key(key, aData[index]));
                    }

                    // That's the usual return value
                    return nRow;
                }
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
            oSelectAll.html("<span class='glyphicon glyphicon-ok' style='float:right;display:inline-block;'></span>Select All");
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
                if (oSettings.nTable.id != self.options.plugin_uuid + '__table')
                    return true;
                return self._querytable_filter.call(self, oSettings, aData, iDataIndex);
            });

            /* Processing hidden_columns */
            $.each(this.options.hidden_columns, function(i, field) {
                self.hide_column(field);
            });
            $(".dataTables_filter").append("<div style='display:inline-block;height:27px;width:27px;padding-left:6px;padding-top:4px;'><span class='glyphicon glyphicon-search'></span></div>");
            $(".dataTables_filter input").css("width","100%");
        }, // initialize_table

        /**
         * @brief Determine index of key in the table columns 
         * @param key
         * @param cols
         */
        getColIndex: function(key, cols) {
            var self = this;
            var tabIndex = $.map(cols, function(x, i) { if (self._get_map(x.sTitle) == key) return i; });
            return (tabIndex.length > 0) ? tabIndex[0] : -1;
        }, // getColIndex

    // create a checkbox <input> tag
    // computes 'id' attribute from canonical_key
    // computes 'init_id' from init_key for initialization phase
    // no need to used convoluted ids with plugin-uuid or others, since
    // we search using table.$ which looks only in this table
        checkbox_html : function (record) {
            var result="";
            // Prefix id with plugin_uuid
            result += "<input";
            result += " class='querytable-checkbox'";
     // compute id from canonical_key
        var id = record[this.canonical_key]
     // compute init_id form init_key
        var init_id=record[this.init_key];
     // set id - for retrieving from an id, or for posting events upon user's clicks
        result += " id='"+record[this.canonical_key]+"'";
     // set init_id
        result += "init_id='" + init_id + "'";
     // wrap up
            result += " type='checkbox'";
            result += " autocomplete='off'";
            result += "></input>";
            return result;
        }, 


        new_record: function(record)
        {
            var self = this;

            // this models a line in dataTables, each element in the line describes a cell
            line = new Array();
     
            // go through table headers to get column names we want
            // in order (we have temporarily hack some adjustments in names)
            var cols = this._get_columns();
            var colnames = cols.map(function(x) {return self._get_map(x.sTitle)})
            var nb_col = cols.length;
            /* if we've requested checkboxes, then forget about the checkbox column for now */
            //if (this.options.checkboxes) nb_col -= 1;
            // catch up with the last column if checkboxes were requested 
            if (this.options.checkboxes) {
                // Use a key instead of hostname (hard coded...)
                line.push(this.checkbox_html(record));
            }
            line.push('<span id="' + this.id_from_key('status', record[this.init_key]) + '"></span>'); // STATUS
            
            /* fill in stuff depending on the column name */
            for (var j = 2; j < nb_col - 1; j++) { // nb_col includes status
                if (typeof colnames[j] == 'undefined') {
                    line.push('...');
                } else if (colnames[j] == 'hostname') {
                    if (record['type'] == 'resource,link')
                        //TODO: we need to add source/destination for links
                        line.push('');
                    else
                        line.push(record['hostname']);

                } else if (colnames[j] == this.init_key && typeof(record) != 'undefined') {
                    obj = this.object
                    o = obj.split(':');
                    if(o.length>1){
                        obj = o[1];
                    }else{
                        obj = o[0];
                    }
                    /* XXX TODO: Remove this and have something consistant */
                    if(obj=='resource'){
                        //line.push('<a href="../'+obj+'/'+record['urn']+'"><span class="glyphicon glyphicon-search"></span></a> '+record[this.init_key]);
                    }else{
                        //line.push('<a href="../'+obj+'/'+record[this.init_key]+'"><span class="glyphicon glyphicon-search"></span></a> '+record[this.init_key]);
                    }
                    line.push(record[this.init_key]);
                } else {
                    if (record[colnames[j]])
                        line.push(record[colnames[j]]);
                    else
                        line.push('');
                }
            }
    
            // adding an array in one call is *much* more efficient
            // this.table.fnAddData(line);
            return line;
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

        set_checkbox_from_record_key: function (record_key, checked) 
        {
            if (checked === undefined) checked = true;

            // using table.$ to search inside elements that are not visible
            var element = this.table.$('[init_id="'+record_key+'"]');
            element.attr('checked',checked);
        },

        // id relates to canonical_key
        set_checkbox_from_data: function (id, checked) 
        {
            if (checked === undefined) checked = true;

            // using table.$ to search inside elements that are not visible
            var element = this.table.$("[id='"+id+"']");
            element.attr('checked',checked);
        },

        /**
         * Arguments
         *
         * key_value: the key from which we deduce the id
         * request: STATUS_OKAY, etc.
         * content: some HTML content
         */
        change_status: function(key_value, warnings)
        {
            var msg;
            
            if ($.isEmptyObject(warnings)) { 
                var state = manifold.query_store.get_record_state(this.options.query_uuid, key_value, STATE_SET);
                switch(state) {
                    case STATE_SET_IN:
                    case STATE_SET_IN_SUCCESS:
                    case STATE_SET_OUT_FAILURE:
                    case STATE_SET_IN_PENDING:
                        // Checkmark sign if no warning for an object in the set
                        msg = '&#10003;';
                        break;
                    default:
                        // Nothing is the object is not in the set
                        msg = '';
                        break;
                }
            } else {
                msg = '<ul class="nav nav-pills">';
                msg += '<li class="dropdown">'
                msg += '<a href="#" data-toggle="dropdown" class="dropdown-toggle nopadding"><b>&#9888</b></a>';
                msg += '  <ul class="dropdown-menu dropdown-menu-right" id="menu1">';
                $.each(warnings, function(i,warning) {
                    msg += '<li><a href="#">' + warning + '</a></li>';
                });
                msg += '  </ul>';
                msg += '</li>';
                msg += '</ul>';
            }

            $(document.getElementById(this.id_from_key('status', key_value))).html(msg);
            $('[data-toggle="tooltip"]').tooltip({'placement': 'bottom'});

        },

        set_bgcolor: function(key_value, class_name)
        {
            var elt = $(document.getElementById(this.id_from_key(this.canonical_key, key_value)))
            if (class_name == QUERYTABLE_BGCOLOR_RESET)
                elt.removeClass('added removed');
            else
                elt.addClass((class_name == QUERYTABLE_BGCOLOR_ADDED ? 'added' : 'removed'));
        },

        populate_table: function()
        {
            // Let's clear the table and only add lines that are visible
            var self = this;
            this.clear_table();

            lines = Array();
            var record_keys = [];
            manifold.query_store.iter_records(this.options.query_uuid, function (record_key, record) {
                lines.push(self.new_record(record));
                record_keys.push(record_key);
            });
            this.table.fnAddData(lines);
            $.each(record_keys, function(i, record_key) {
                var state = manifold.query_store.get_record_state(self.options.query_uuid, record_key, STATE_SET);
                var warnings = manifold.query_store.get_record_state(self.options.query_uuid, record_key, STATE_WARNINGS);
                switch(state) {
                    // XXX The row and checkbox still does not exists !!!!
                    case STATE_SET_IN:
                    case STATE_SET_IN_SUCCESS:
                    case STATE_SET_OUT_FAILURE:
                        self.set_checkbox_from_record_key(record_key, true);
                        break;
                    case STATE_SET_OUT:
                    case STATE_SET_OUT_SUCCESS:
                    case STATE_SET_IN_FAILURE:
                        //self.set_checkbox_from_record_key(record_key, false);
                        break;
                    case STATE_SET_IN_PENDING:
                        self.set_checkbox_from_record_key(record_key, true);
                        self.set_bgcolor(record_key, QUERYTABLE_BGCOLOR_ADDED);
                        break;
                    case STATE_SET_OUT_PENDING:
                        //self.set_checkbox_from_record_key(record_key, false);
                        self.set_bgcolor(record_key, QUERYTABLE_BGCOLOR_REMOVED);
                        break;
                }
                self.change_status(record_key, warnings); // XXX will retrieve status again
            });
        },

        /*************************** QUERY HANDLER ****************************/

        on_filter_added: function(filter)
        {
            this.redraw_table();
        },

        on_filter_removed: function(filter)
        {
            this.redraw_table();
        },
        
        on_filter_clear: function()
        {
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
            alert('QueryTable::clear_fields() not implemented');
        },

        /*************************** RECORD HANDLER ***************************/

        // Could be the default in parent
        on_query_in_progress: function()
        {
            this.spin();
        },

        on_query_done: function()
        {
            this.populate_table();
            this.unspin();
        },
        
        on_field_state_changed: function(data)
        {
            // XXX We could get this from data.value
            // var state = manifold.query_store.get_record_state(this.options.query_uuid, data.value, data.state);

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
        },

        /************************** PRIVATE METHODS ***************************/

        _get_columns: function()
        {
            return this.table.fnSettings().aoColumns;
            // XXX return $.map(table.fnSettings().aoColumns, function(x, i) { return QUERYTABLE_MAP[x]; });
        },

        _get_map: function(column_title) {
            return (column_title in QUERYTABLE_MAP) ? QUERYTABLE_MAP[column_title] : column_title;
        },
        /** 
         * @brief QueryTable filtering function, called for every line in the datatable.
         * 
         * Return value:
         *   boolean determining whether the column is visible or not.
         */
        _querytable_filter: function(oSettings, aData, iDataIndex)
        {
            var self = this;
            var key_col, record_key_value;

            /* Determine index of key in the table columns */
            key_col = $.map(oSettings.aoColumns, function(x, i) {if (self._get_map(x.sTitle) == self.canonical_key) return i;})[0];

            /* Unknown key: no filtering */
            if (typeof(key_col) == 'undefined') {
                console.log("Unknown key");
                return true;
            }

            record_key_value = unfold.get_value(aData[key_col]);

            return manifold.query_store.get_record_state(this.options.query_uuid, record_key_value, STATE_VISIBLE);
        },

        _querytable_draw_callback: function()
        {
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

        _check_click: function(e) 
        {
            var data;
            var self = e.data;

            e.stopPropagation();

            data = {
                state: STATE_SET,
                key  : null,
                op   : this.checked ? STATE_SET_ADD : STATE_SET_REMOVE,
                value: this.id
            }
            manifold.raise_event(self.options.query_uuid, FIELD_STATE_CHANGED, data);
            //return false; // prevent checkbox to be checked, waiting response from manifold plugin api
            
        },

        _selectAll: function() 
        {
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

  /* define the 'dom-checkbox' type for sorting in datatables 
     http://datatables.net/examples/plug-ins/dom_sort.html
     using trial and error I found that the actual column number
     was in fact given as a third argument, and not second 
     as the various online resources had it - go figure */
    $.fn.dataTableExt.afnSortData['dom-checkbox'] = function  ( oSettings, _, iColumn ) {
        return $.map( oSettings.oApi._fnGetTrNodes(oSettings), function (tr, i) {
            return result=$('td:eq('+iColumn+') input', tr).prop('checked') ? '1' : '0';
        });
    };

})(jQuery);

