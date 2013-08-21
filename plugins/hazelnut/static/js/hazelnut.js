/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

(function($){

    // TEMP
    var ELEMENT_KEY = 'resource_hrn';
    var debug=false;
    debug=true

    var Hazelnut = Plugin.extend({

        init: function(options, element) 
        {
            this._super(options, element);

            /* Member variables */
            // query status
            this.received_all = false;
            this.received_set = false;
            this.in_set_buffer = Array();

            /* XXX Events XXX */
            // this.$element.on('show.Datatables', this.on_show);
            this.el().on('show', this, this.on_show);
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

        default_options: {
            'checkboxes': false
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
                fnDrawCallback: function() { self._hazelnut_draw_callback.call(self); }
                // XXX use $.proxy here !
            };
            // the intention here is that options.datatables_options as coming from the python object take precedence
            //  XXX DISABLED by jordan: was causing errors in datatables.js     $.extend(actual_options, options.datatables_options );
            this.table = this.el('table').dataTable(actual_options);

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

 // UNUSED ? //         this.update_plugin = function(e, rows) {
 // UNUSED ? //             // e.data is what we passed in second argument to subscribe
 // UNUSED ? //             // so here it is the jquery object attached to the plugin <div>
 // UNUSED ? //             var $plugindiv=e.data;
 // UNUSED ? //             if (debug)
 // UNUSED ? //                 messages.debug("entering hazelnut.update_plugin on id '" + $plugindiv.attr('id') + "'");
 // UNUSED ? //             // clear the spinning wheel: look up an ancestor that has the need-spin class
 // UNUSED ? //             // do this before we might return
 // UNUSED ? //             $plugindiv.closest('.need-spin').spin(false);
 // UNUSED ? // 
 // UNUSED ? //             var options = this.options;
 // UNUSED ? //             var hazelnut = this;
 // UNUSED ? //     
 // UNUSED ? //             /* if we get no result, or an error, try to make that clear, and exit */
 // UNUSED ? //             if (rows.length==0) {
 // UNUSED ? //                 if (debug) 
 // UNUSED ? //                     messages.debug("Empty result on hazelnut " + this.options.domid);
 // UNUSED ? //                 var placeholder=$(this.table).find("td.dataTables_empty");
 // UNUSED ? //                 console.log("placeholder "+placeholder);
 // UNUSED ? //                 if (placeholder.length==1) 
 // UNUSED ? //                     placeholder.html(unfold.warning("Empty result"));
 // UNUSED ? //                 else
 // UNUSED ? //                     this.table.html(unfold.warning("Empty result"));
 // UNUSED ? //                     return;
 // UNUSED ? //             } else if (typeof(rows[0].error) != 'undefined') {
 // UNUSED ? //                 // we now should have another means to report errors that this inline/embedded hack
 // UNUSED ? //                 if (debug) 
 // UNUSED ? //                     messages.error ("undefined result on " + this.options.domid + " - should not happen anymore");
 // UNUSED ? //                 this.table.html(unfold.error(rows[0].error));
 // UNUSED ? //                 return;
 // UNUSED ? //             }
 // UNUSED ? // 
 // UNUSED ? //             /* 
 // UNUSED ? //              * fill the dataTables object
 // UNUSED ? //              * we cannot set html content directly here, need to use fnAddData
 // UNUSED ? //              */
 // UNUSED ? //             var lines = new Array();
 // UNUSED ? //     
 // UNUSED ? //             this.current_resources = Array();
 // UNUSED ? //     
 // UNUSED ? //             $.each(rows, function(index, row) {
 // UNUSED ? //                 // this models a line in dataTables, each element in the line describes a cell
 // UNUSED ? //                 line = new Array();
 // UNUSED ? //      
 // UNUSED ? //                 // go through table headers to get column names we want
 // UNUSED ? //                 // in order (we have temporarily hack some adjustments in names)
 // UNUSED ? //                 var cols = object.table.fnSettings().aoColumns;
 // UNUSED ? //                 var colnames = cols.map(function(x) {return x.sTitle})
 // UNUSED ? //                 var nb_col = cols.length;
 // UNUSED ? //                 /* if we've requested checkboxes, then forget about the checkbox column for now */
 // UNUSED ? //                 if (options.checkboxes) nb_col -= 1;
 // UNUSED ? // 
 // UNUSED ? //                 /* fill in stuff depending on the column name */
 // UNUSED ? //                 for (var j = 0; j < nb_col; j++) {
 // UNUSED ? //                     if (typeof colnames[j] == 'undefined') {
 // UNUSED ? //                         line.push('...');
 // UNUSED ? //                     } else if (colnames[j] == 'hostname') {
 // UNUSED ? //                         if (row['type'] == 'resource,link')
 // UNUSED ? //                             //TODO: we need to add source/destination for links
 // UNUSED ? //                             line.push('');
 // UNUSED ? //                         else
 // UNUSED ? //                             line.push(row['hostname']);
 // UNUSED ? //                     } else {
 // UNUSED ? //                         if (row[colnames[j]])
 // UNUSED ? //                             line.push(row[colnames[j]]);
 // UNUSED ? //                         else
 // UNUSED ? //                             line.push('');
 // UNUSED ? //                     }
 // UNUSED ? //                 }
 // UNUSED ? //     
 // UNUSED ? //                 /* catch up with the last column if checkboxes were requested */
 // UNUSED ? //                 if (options.checkboxes) {
 // UNUSED ? //                     var checked = '';
 // UNUSED ? //                     // xxx problem is, we don't get this 'sliver' thing set apparently
 // UNUSED ? //                     if (typeof(row['sliver']) != 'undefined') { /* It is equal to null when <sliver/> is present */
 // UNUSED ? //                         checked = 'checked ';
 // UNUSED ? //                         hazelnut.current_resources.push(row[ELEMENT_KEY]);
 // UNUSED ? //                     }
 // UNUSED ? //                     // Use a key instead of hostname (hard coded...)
 // UNUSED ? //                     line.push(hazelnut.checkbox(options.plugin_uuid, row[ELEMENT_KEY], row['type'], checked, false));
 // UNUSED ? //                 }
 // UNUSED ? //     
 // UNUSED ? //                 lines.push(line);
 // UNUSED ? //     
 // UNUSED ? //             });
 // UNUSED ? //     
 // UNUSED ? //             this.table.fnClearTable();
 // UNUSED ? //             if (debug)
 // UNUSED ? //                 messages.debug("hazelnut.update_plugin: total of " + lines.length + " rows");
 // UNUSED ? //             this.table.fnAddData(lines);
 // UNUSED ? //         
 // UNUSED ? //         }, // update_plugin

        checkbox: function (plugin_uuid, header, field) //, selected_str, disabled_str)
        {
            var result="";
            if (header === null)
                header = '';
            // Prefix id with plugin_uuid
            result += "<input";
            result += " class='hazelnut-checkbox'";
            result += " id='" + this.id('checkbox', this.id_from_key(this.key, unfold.get_value(header))) + "'";
             //hazelnut-checkbox-" + plugin_uuid + "-" + unfold.get_value(header).replace(/\\/g, '')  + "'";
            result += " name='" + unfold.get_value(field) + "'";
            result += " type='checkbox'";
            //result += selected_str;
            //result += disabled_str;
            result += " autocomplete='off'";
            result += " value='" + unfold.get_value(header) + "'";
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
    
            /* catch up with the last column if checkboxes were requested */
            if (this.options.checkboxes)
                // Use a key instead of hostname (hard coded...)
                // XXX remove the empty checked attribute
                line.push(this.checkbox(this.options.plugin_uuid, record[ELEMENT_KEY], record['type']));
    
            // XXX Is adding an array of lines more efficient ?
            this.table.fnAddData(line);

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
            if (typeof checked === 'undefined')
                checked = true;

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


            var checkbox_id = this.id('checkbox', this.id_from_key(this.key, key_value));
            checkbox_id = '#' + checkbox_id.replace(/\./g, '\\.');

            var element = $(checkbox_id, this.table.fnGetNodes());

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
            /* NOTE in fact we are doing a join here */
            if (this.received_all)
                // update checkbox for record
                this.set_checkbox(record, true);
            else
                // store for later update of checkboxes
                this.in_set_buffer.push(record);
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
            if (this.received_all)
                this.unspin();
            this.received_set = true;
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
            var self = this;
            if (this.received_set) {
                /* XXX needed ? XXX We uncheck all checkboxes ... */
                $("[id^='datatables-checkbox-" + this.options.plugin_uuid +"']").attr('checked', false);

                /* ... and check the ones specified in the resource list */
                $.each(this.in_set_buffer, function(i, record) {
                    self.set_checkbox(record, true);
                });

                this.unspin();
            }
            this.received_all = true;

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
            this.els('hazelnut-checkbox').unbind('click').click(this, this._check_click);

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

})(jQuery);
