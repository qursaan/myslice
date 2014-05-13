/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */ 

(function($){

    var debug=false;
    debug=true

    var UnivbrisFvf = Plugin.extend({

        init: function(options, element) {
	    //alert("foam init called");
	    this.classname="univbrisfvf";
            this._super(options, element);
		
	    //alert(this.options.hidden_columns);
            /* Member variables */
	    // in general we expect 2 queries here
	    // query_uuid refers to a single object (typically a slice)
	    // query_all_uuid refers to a list (typically resources or users)
	    // these can return in any order so we keep track of which has been received yet
            //this.received_all_query = false;
            //this.received_query = false;

            // We need to remember the active filter for datatables filtering
            this.filters = Array(); 

            // an internal buffer for records that are 'in' and thus need to be checked 
            this.buffered_records_to_check = [];
	    // an internal buffer for keeping lines and display them in one call to fnAddData
	    this.buffered_lines = [];

            /* Events */
	    // xx somehow non of these triggers at all for now
            //this.elmt().on('show', this, this.on_show);
            //this.elmt().on('shown.bs.tab', this, this.on_show);
            //this.elmt().on('resize', this, this.on_resize);

            //var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            //this.object = query.object;

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
	    // sanity check
	    if ( ! this.init_key ) messages.warning ("UnivbrisFvf : cannot find init_key");
	    if ( ! this.canonical_key ) messages.warning ("UnivbrisFvf : cannot find canonical_key");
	    if (debug) messages.debug("UnivbrisFvf: canonical_key="+this.canonical_key+" init_key="+this.init_key);

            /* Setup query and record handlers */
            //this.listen_query(options.query_uuid);
            //this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */
            //this.initialize_table();
	    //alert("init fvf");
	    jQuery("#uob_fv_table_form").hide();
	
	    $('<button id="cancel_addflowspaceform" type="button" style="height: 25px; width: 200px" onclick="fnCancel()">Cancel</button>').appendTo('#fvf_table_button');

	    $('<button id="addflowspaceform" type="button" style="height: 25px; width: 200px" onclick="fnAddflowspace()">Add flowspace</button>').appendTo('#fvf_table_button');
		
	    this._querytable_draw_callback();
        },

        /* PLUGIN EVENTS */

        on_show: function(e) {
	    if (debug) messages.debug("univbrisfvf.on_show");
            var self = e.data;
            self.table.fnAdjustColumnSizing();
	},        

        on_resize: function(e) {
	    if (debug) messages.debug("univbrisfvf.on_resize");
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
		//sDom: "<'row'<'col-xs-2'l><'col-xs-9'r><'col-xs-2'f>>t<'row'<'col-xs-5'i><'col-xs-5'p>><'next'>",
		sDom: "<'row'<'col-xs-9'r>t<'buttons'>",
		// XXX as of sept. 2013, I cannot locate a bootstrap3-friendly mode for now
		// hopefully this would come with dataTables v1.10 ?
		// in any case, search for 'sPaginationType' all over the code for more comments
                sPaginationType: 'bootstrap',
                // Handle the null values & the error : Datatables warning Requested unknown parameter
                // http://datatables.net/forums/discussion/5331/datatables-warning-...-requested-unknown-parameter/p2
                aoColumnDefs: [{sDefaultContent: '',aTargets: [ '_all' ]}],
                // WARNING: this one causes tables in a 'tabs' that are not exposed at the time this is run to show up empty
                // sScrollX: '100%',       /* Horizontal scrolling */
                bProcessing: false,      /* Loading */
                fnDrawCallback: function() { self._querytable_draw_callback.call(self);}
		//fnFooterCallback: function() {self._univbrisfvf_footer_callback.call(self,nFoot, aData, iStart, iEnd, aiDisplay)};}
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
            this.table = $("#univbris_flowspace_form__table").dataTable(actual_options);

	    //alert(this.table);

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

	   //alert(this.options.hidden_columns);

            /* Processing hidden_columns */
            $.each(this.options.hidden_columns, function(i, field) {
                //manifold.raise_event(self.options.query_all_uuid, FIELD_REMOVED, field);
		//alert (field);
                self.hide_column(field);
		//self.hide_column(field);
            });

        }, // initialize_table


	fnCancel:function(e){
		//var sData=$("#uob_fv_table_form").find("input").serialize();
		//alert("add flowspace:" + sData);
		jQuery("#uob_fv_table_form").hide();
		jQuery( "#univbris_flowspace_selection" ).show();
	},

	fnAddflowspace:function(e){
		if(fvf_add==1){
			pk_flowspace_index=1+pk_flowspace_index;
			jQuery("#uob_fv_table_form").hide();
			var sData=$("#uob_fv_table_form").find("input").serialize();
	     		var form =serializeAnything("#uob_fv_table_form");
			this.table = $("#univbris_flowspace_selection__table").dataTable();
			flowspace=sData;
		
			var string = "<p id='"+form+"'> <a onclick=\'fnPopTable(\""+form+"\");'>"+$("#flowspace_name").val()+"</a></p>";	
			this.table.fnAddData([string, '<a class="edit">Edit</a>', '<a class="delete" href="">Delete</a>']);
			jQuery( "#univbris_flowspace_selection" ).show();
		}
		else{
			jQuery("#uob_fv_table_form").hide();
			var sData=$("#uob_fv_table_form").find("input").serialize();
	     		var form =serializeAnything("#uob_fv_table_form");
			this.table = $("#univbris_flowspace_selection__table").dataTable();
			flowspace=sData;
			
			var string = "<p id='"+form+"'> <a onclick=\'fnPopTable(\""+form+"\");'>"+$("#flowspace_name").val()+"</a></p>";
		   	this.table.fnDeleteRow(fvf_nrow);	
			this.table.fnAddData([string, '<a class="edit">Edit</a>', '<a class="delete" href="">Delete</a>']);
			jQuery( "#univbris_flowspace_selection" ).show();
		
		}
	},


	fnModflowspace:function(e){
		//alert("modify");

		jQuery("#uob_fv_table_form").hide();
		var sData=$("#uob_fv_table_form").find("input").serialize();
     		var form =serializeAnything("#uob_fv_table_form");
		this.table = $("#univbris_flowspace_selection__table").dataTable();
		flowspace=sData;
		alert(form+"\n"+sData);
		
		var string = "<p id='"+form+"'> <a onclick=\'fnPopTable(\""+form+"\");'>"+$("#flowspace_name").val()+"</a></p>";
	   	this.table.fnDeleteRow(fvf_nrow);	
		this.table.fnAddData([string, '<a class="edit">Edit</a>', '<a class="delete" href="">Delete</a>']);
		jQuery( "#univbris_flowspace_selection" ).show();
	},

        /**
         * @brief Determine index of key in the table columns 
         * @param key
         * @param cols
         */
        getColIndex: function(key, cols) {
            var tabIndex = $.map(cols, function(x, i) { if (x.sTitle == key) return i; });
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
            result += " class='univbrisfvf-checkbox'";
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

	 fake_checkbox_html : function (record) {
	    //alert("fake fun called");
            var result="";
            // Prefix id with plugin_uuid
            result += "<input";
            //result += " class='univbrisfvf-checkbox'";
	 // set id - for retrieving from an id, or for posting events upon user's clicks
	    result += " id='"+ record +"'";
	    result += " name='"+ record +"'";
	 // set init_id
	    result += " init_id='" + record + "'";
	 // wrap up
            result += " type='checkbox'";
            result += " autocomplete='off'";
            result += "></input>";
	    ///alert(result);
            return result;
        }, 


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
	    
	    //alert(colnames);
	    /*replace production*/
            /* fill in stuff depending on the column name */
             var cols = this.table.fnSettings().aoColumns;
	    //alert("col "+cols);
            var colnames = cols.map(function(x) {return x.sTitle})
            var nb_col = cols.length;
			//alert("nb_col: "+ nb_col);
            /* if we've requested checkboxes, then forget about the checkbox column for now */
            if (this.options.checkboxes) nb_col -= 1;
	    		//alert("nb_col: "+ nb_col);
	    //alert(colnames);
	    /*replace production*/
            /* fill in stuff depending on the column name */
            for (var j = 0; j < nb_col; j++) {
                if (typeof colnames[j] == 'undefined') {
                    line.push('...');
                } else if (colnames[j] == 'Flowspace Selector') {
		    //alert("added");
                    line.push("first");
		}
		

		/*if (typeof colnames[j] == 'undefined') {
                    line.push('...');
                } else if (colnames[j] == 'hostname') {
                    if (record['type'] == 'resource,link')
                        //TODO: we need to add source/destination for links
                        line.push('');
                    else
                        line.push(record['hostname']);

                } else if (colnames[j] == 'hrn' && typeof(record) != 'undefined') {
                    line.push('<a href="../resource/'+record['urn']+'"><span class="glyphicon glyphicon-search"></span></a> '+record['hrn']);
                } else {
                    if (record[colnames[j]])
                        line.push(record[colnames[j]]);
                    else
                        line.push('');
                }*/
            }
    
            // catch up with the last column if checkboxes were requested 
            if (this.options.checkboxes) {
                // Use a key instead of hostname (hard coded...)
                line.push(this.checkbox_html(record));
	        }
    
    	    // adding an array in one call is *much* more efficient
	        // this.table.fnAddData(line);
	        this.buffered_lines.push(line);
		this.table.fnAddData(this.buffered_lines);
		//this.table.redraw();
		//this._querytable_draw_callback();
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
	    //index=-1;
	    //alert(field + ": index: " + index );
            if (index != -1)
		//alert(field + ": hidden with index: " + index );
                this.table.fnSetColumnVis(index, false);
        },

	// this is used at init-time, at which point only init_key can make sense
	// (because the argument record, if it comes from query, might not have canonical_key set
	set_checkbox_from_record: function (record, checked) {
            if (checked === undefined) checked = true;
	    var init_id = record[this.init_key];
	    if (debug) messages.debug("univbrisfvf.set_checkbox_from_record, init_id="+init_id);
	    // using table.$ to search inside elements that are not visible
	    var element = this.table.$('[init_id="'+init_id+'"]');
	    element.attr('checked',checked);
	},

	// id relates to canonical_key
	set_checkbox_from_data: function (id, checked) {
            if (checked === undefined) checked = true;
	    if (debug) messages.debug("univbrisfvf.set_checkbox_from_data, id="+id);
	    // using table.$ to search inside elements that are not visible
	    var element = this.table.$("[id='"+id+"']");
	    element.attr('checked',checked);
	},

        /*************************** QUERY HANDLER ****************************/

        on_filter_added: function(filter)
        {
            this.filters.push(filter);
            this.redraw_table();
        },

        on_filter_removed: function(filter)
        {
            // Remove corresponding filters
            this.filters = $.grep(this.filters, function(x) {
                return x != filter;
            });
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
            alert('UnivbrisFvf::clear_fields() not implemented');
        },

        /* XXX TODO: make this generic a plugin has to subscribe to a set of Queries to avoid duplicated code ! */
        /*************************** ALL QUERY HANDLER ****************************/

        on_all_filter_added: function(filter)
        {
            // XXX
            this.redraw_table();
        },

        on_all_filter_removed: function(filter)
        {
            // XXX
            this.redraw_table();
        },
        
        on_all_filter_clear: function()
        {
            // XXX
            this.redraw_table();
        },

        on_all_field_added: function(field)
        {
            this.show_column(field);
        },

        on_all_field_removed: function(field)
        {
            this.hide_column(field);
        },

        on_all_field_clear: function()
        {
            alert('UnivbrisFvf::clear_fields() not implemented');
        },


        /*************************** RECORD HANDLER ***************************/

        on_new_record: function(record)
        {
            if (this.received_all_query) {
        	// if the 'all' query has been dealt with already we may turn on the checkbox
                this.set_checkbox_from_record(record, true);
            } else {
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
                    this.set_checkbox_from_data(data.value, true);
                    break;
                case FIELD_REQUEST_REMOVE:
                case FIELD_REQUEST_REMOVE_RESET:
                    this.set_checkbox_from_data(data.value, false);
                    break;
                default:
                    break;
            }
        },

        /* XXX TODO: make this generic a plugin has to subscribe to a set of Queries to avoid duplicated code ! */
        // all
        on_all_field_state_changed: function(data)
        {
            switch(data.request) {
                case FIELD_REQUEST_ADD:
                case FIELD_REQUEST_ADD_RESET:
                    this.set_checkboxfrom_data(data.value, true);
                    break;
                case FIELD_REQUEST_REMOVE:
                case FIELD_REQUEST_REMOVE_RESET:
                    this.set_checkbox_from_data(data.value, false);
                    break;
                default:
                    break;
            }
        },

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
		if (debug) messages.debug ("querytable delayed turning on checkbox " + i + " record= " + record);
                self.set_checkbox_from_record(record, true);
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
        _querytable_filter: function(oSettings, aData, iDataIndex)
        {
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

        _querytable_draw_callback: function()
        {
            /* 
             * Handle clicks on checkboxes: reassociate checkbox click every time
             * the table is redrawn    
             */
            this.elts('querytable-checkbox').unbind('click').click(this, this._check_click);
	    //alert("fvf_add: "+fvf_add);
	    if(fvf_add==1){
	    	$("#addflowspaceform").unbind('click').click(this, this.fnAddflowspace);
	    }
	    else{
		$("[id='addflowspaceform'").unbind('click').click(this, this.fnModflowspace);
	    }
	    $("#cancel_addflowspaceform").unbind('click').click(this,this.fnCancel);

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
            e.stopPropagation();

            var self = e.data;
	    var id=this.id;

            // this.id = key of object to be added... what about multiple keys ?
	    if (debug) messages.debug("querytable._check_click key="+this.canonical_key+"->"+id+" checked="+this.checked);
            //manifold.raise_event(self.options.query_uuid, this.checked?SET_ADD:SET_REMOVED, id);
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

    $.plugin('UnivbrisFvf', UnivbrisFvf);

  /* define the 'dom-checkbox' type for sorting in datatables 
     http://datatables.net/examples/plug-ins/dom_sort.html
     using trial and error I found that the actual column number
     was in fact given as a third argument, and not second 
     as the various online resources had it - go figure */
    $.fn.dataTableExt.afnSortData['dom-checkbox'] = function  ( oSettings, _, iColumn ) {
	return $.map( oSettings.oApi._fnGetTrNodes(oSettings), function (tr, i) {
	    return result=$('td:eq('+iColumn+') input', tr).prop('checked') ? '1' : '0';
	} );

};

})(jQuery);



function fnPopTable(e){
		//alert("e: "+e);
		//this.table = $("#univbris_flowspace_selection__table").dataTable();
		//alert(this.table);
                /**var rows = $("#univbris_flowspace_selection__table").dataTable().fnGetNodes();
		for(var i=0;i<rows.length;i++)
        	{
            		alert($(rows[i]).find("td:eq(0)").html()); 
        	}
		**/


		//var anSelected = fnGetSelected( this.table );
		//var iRow = oTable.fnGetPosition( anSelected[0] );
		//alert(iRow);

		//var rowIndex = this.table.fnGetPosition( $(this).closest('tr')[0]);
		//alert(rowIndex);
                $("[id='addflowspaceform']").hide();
		$("#uob_fv_table_form :input").prop("disabled", false);
		$("#uob_fv_table_form").deserialize(e);
                $("[name='flowspace_name']").prop("disabled", true)
		$("#uob_fv_table_form :input").prop("disabled", true);
		$("[id='cancel_addflowspaceform']").prop("disabled", false);
		$("[id='cancel_addflowspaceform']").text('close');
		//$("[id='addflowspaceform'").hide();
		jQuery("#univbris_flowspace_selection").hide();
		jQuery("#uob_fv_table_form").show();
};



function fnGetSelected( oTableLocal )
{
	var aReturn = new Array();
	var aTrs = oTableLocal.fnGetNodes();
	
	for ( var i=0 ; i<aTrs.length ; i++ )
	{
		if ( $(aTrs[i]).hasClass('row_selected') )
		{
			aReturn.push( aTrs[i] );
		}
	}
	return aReturn;
}

function serializeAnything (form){
	var toReturn	= [];
	var els 	= $(form).find(':input').get();

	$.each(els, function() {			
		if (this.name && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type))) {
				var val = $(this).val();
				toReturn.push( encodeURIComponent(this.name) + "=" + encodeURIComponent( val ) );
			}
		});

		return toReturn.join("&").replace(/%20/g, "+");

}


(function ($) {
    $.fn.extend({
        deserialize : function (d, config) {
            var data = d,
                currentDom,
                $current = null,
                $currentSavedValue = null,
                $self = this,
                i = 0,
                keyValPairString = [],
                keyValPairObject = {},
                tmp = null,
                defaults = null;

            if (d === undefined || !$self.is('form')) {
                return $self;
            }

            defaults = {
                overwrite : true
            };

            config = $.extend(defaults, config);

            if (d.constructor === String) {


                d = decodeURIComponent(d.replace(/\+/g, " "));

                keyValPairString = d.split('&');

                for (i = 0; i < keyValPairString.length; i++) {
                    tmp = keyValPairString[i].split('=');
                    keyValPairObject[tmp[0]] = tmp[1];

                }
            }

            $('input, select, textarea', $self).each(function (i) {

                $current = $(this);
                currentDom = $current.get(0);
                $currentSavedValue = keyValPairObject[$current.attr('name')];

                if (currentDom.disabled === true) {
		    //current.val($currentSavedValue);
                    return true;
                }

                if ($current.is('textarea')) {
                    if ($currentSavedValue === undefined) {
                        $current.val('');
                    } else {
                        $current.val($currentSavedValue);
                    }
                    return true;
                }

                if ($current.is('select')) {
                    if ($currentSavedValue === undefined) {
                        return true;
                    } else {
                        currentDom.selectedIndex = $currentSavedValue;
                    }
                    return true;
                }

                if ($current.is('input:radio')) {
                    if ($currentSavedValue !== undefined) {

                        $current.each(function () {
                            if ($(this).val() === $currentSavedValue) {
                                $(this).get(0).checked = true;
                            }
                        });
                    }

                    return true;
                }

                if ($current.is('input:checkbox')) {
                    currentDom.checked = ($current.val() === $currentSavedValue);
                    return true;
                }

                if ($current.is('input:text, input:hidden')) {
                    if ($currentSavedValue === undefined) {
                        $current.val('');
                    } else {
                        $current.val($currentSavedValue);
                        return true;
                    }

                }

            });

            return $self;
        }

    });


}(jQuery));


