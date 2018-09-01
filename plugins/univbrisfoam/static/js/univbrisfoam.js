/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

(function($){

    var debug=false;
    window.query_itr2=0;
    table_links=[];
    //debug=true

    regex_filter="((packet)|(compute))";

    var UnivbrisFoam = Plugin.extend({

        init: function(options, element) {
	    //alert("foam init called");
	    this.classname="univbrisfoam";
            this._super(options, element);
		
	    //alert(this.options.hidden_columns);
            /* Member variables */
	    // in general we expect 2 queries here
	    // query_uuid refers to a single object (typically a slice)
	    // query_all_uuid refers to a list (typically resources or users)
	    // these can return in any order so we keep track of which has been received yet
            this.received_all_query = false;
            this.received_query = false;

            // We need to remember the active filter for datatables filtering
            this.filters = Array(); 

            // an internal buffer for records that are 'in' and thus need to be checked 
            this.buffered_records_to_check = [];
	    // an internal buffer for keeping lines and display them in one call to fnAddData
	    this.buffered_lines = [];

            /* Events */
	    // xx somehow non of these triggers at all for now
            this.elmt().on('show', this, this.on_show);
            this.elmt().on('shown.bs.tab', this, this.on_show);
            this.elmt().on('resize', this, this.on_resize);

            var query = manifold.query_store.find_analyzed_query(this.options.query_uuid);
            this.object = query.object;

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
	    if ( ! this.init_key ) messages.warning ("UnivbrisFoam : cannot find init_key");
	    if ( ! this.canonical_key ) messages.warning ("UnivbrisFoam : cannot find canonical_key");
	    if (debug) messages.debug("UnivbrisFoam: canonical_key="+this.canonical_key+" init_key="+this.init_key);
            /* Setup query and record handlers */
            this.listen_query(options.query_uuid);
            this.listen_query(options.query_all_uuid, 'all');
	    this.listen_query(options.sync_query_uuid,'sync');

            /* GUI setup and event binding */
            this.initialize_table();

	    jQuery( "#univbris_foam_ports_selection" ).hide();
	    
        },

        /* PLUGIN EVENTS */

        on_show: function(e) {
	    if (debug) messages.debug("univbrisfoam.on_show");
            var self = e.data;
            self.table.fnAdjustColumnSizing();
	},        

        on_resize: function(e) {
	    if (debug) messages.debug("univbrisfoam.on_resize");
            var self = e.data;
            self.table.fnAdjustColumnSizing();
	},        

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        initialize_table: function() 
        {
            /* Transforms the table into DataTable, and keep a pointer to it */
		//alert("init");
            var self = this;
            var actual_options = {
                // Customize the position of Datatables elements (length,filter,button,...)
                // we use a fluid row on top and another on the bottom, making sure we take 12 grid elt's each time
                //sDom: "<'row'<'col-xs-5'l><'col-xs-1'r><'col-xs-6'f>>t<'row'<'col-xs-5'i><'col-xs-7'p>>",
		sDom: "<'row'<'col-xs-5'l><'col-xs-1'r><'col-xs-6'f>>t<'row'<'col-xs-5'i><'col-xs-5'p>>",
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
                fnDrawCallback: function() { self._querytable_draw_callback.call(self);}
		//fnFooterCallback: function() {self._univbrisfoam_footer_callback.call(self,nFoot, aData, iStart, iEnd, aiDisplay)};}
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
            this.table = $("#univbris_foam_ports_selection__table").dataTable(actual_options);
	
	    //this.table = this.elmt("table").dataTable(actual_options);
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

	    //$('<button id="next" type="button" style="height: 50px; width: 300px" onclick="fnButnext()">select flowspace</button>').appendTo('div.next');

	    //type="submit"

	      //$('<a href="http://localhost:8000/login/" id="next_link">next link</a>').appendTo('div.next');
	    //$("#univbris_flowspace_selection").style.display="none";
	    

        }, // initialize_table


	fnButnext:function(e){
		e.stopPropagation();
		//var sData = this.table.$('input').serialize();
		//var sData = $(this).closest('checkboxes__table').find('input').serialize();
		//var sData = $("form").find('input').serialize();
		//var element=this.table.$("id="'NEC A/80<->NEC B/1080'"");
		//var element=this.table.$("[id='"+"NEC A/80<->NEC B/1080"+"']");
		//var x = element.checked;
		//var uuid=this.id.split("-");
		//var oTable=$('checkboxes__table').dataTable();
		//var oTable=$.fn.dataTable();
		//this.elts("table").unbind('click').click(this, this.fnButnext);
		//var sData = $('input', oTable.fnGetNodes()).serialize();
		//$.fn.dataTable()
		//sData="test";
		///var self = e.data;
		//self=self.options.query_uuid;
		//var oTable=$("#querytable-"+self).dataTable();
		//var sData = $('input', oTable.fnGetNodes()).serialize();
		//e.stopPropagation();
		//var oTable=$('#myTable').dataTable();
		//var sData = $('input', $("#uob_form")).serialize();
		//$("#univbris_flowspace_selection").style.visibility='visible';
		var sData=$("#uob_form").find("input").serialize();
		//alert("clicked: "+sData);
		jQuery( "#univbris_flowspace_selection" ).show();
		//$("#multi_flowpspace_ports_selected").append('<label><input type="checkbox" name="option[]" value="1" />chocolate</label>');

		//$("form#uob_form :input[type=checkbox]").each(function(){
 		//	var input = $(this); // This is the jquery object of the input, do what you will
		//	//alert("id: "+ input.attr('id') + " checked: "+ input.is(':checked'));
		//	if(input.is(':checked')==true){
		//		//alert("got true");
		//		$("#multi_flowpspace_ports_selected").append('<label><input type="checkbox" name="'+input.attr('id')+'" />'+input.attr('id')+'</label>');
		//	}
		//});

		jQuery( "#univbris_foam_ports_selection" ).hide();
		//jQuery( "#univbris_flowspace_selection" ).hide();

		//var url = "http://localhost:8000/login/";    
		//$(location).attr('href',url);
		//window.location.href = "http://localhost:8000/login/"
		//window.location.replace("http://localhost:8000/login/");
		//UnivbrisFv(options,elements);

			//$("#next_link").click();
			
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
            result += " class='univbrisfoam-checkbox'";
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

	fnLinkClick:function(link){
		//console.log("link has been clicked: ");
		//console.log(link.target.id);

		var svg_links = svg.selectAll(".link");
		for(var i=0;i<svg_links[0].length;i++){
			//console.log(svg_links[0][i].__data__.value);
			if(svg_links[0][i].__data__.value==link.target.id){
				//console.log("got clicked link in svg");
				//console.log(link);
				if(link.target.checked==true){
					svg_links[0][i].style.stroke= 'black';
					svg_links[0][i].style.strokeWidth= '5px';
				}
				else{
					svg_links[0][i].style.stroke= '#ccc';
					svg_links[0][i].style.strokeWidth= '4px';
				}
				//svg.transition();
				break;
			}
	
		}
		//console.log(svg_links);
	},

	 fake_checkbox_html : function (record) {
	    //alert("fake fun called");
            var result="";
            // Prefix id with plugin_uuid
            result += "<input";
            //result += " class='univbrisfoam-checkbox'";
	 // set id - for retrieving from an id, or for posting events upon user's clicks
	    result += " id='"+ record +"'";
	    result += " name='"+ record +"'";
	    result += " class='checkboxlink'";
	    //result += " onclick=fnLinkClick(this)";
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

	    var urn = record['urn'];
            var pos = urn.search('link');
	    if (pos!=-1){
		    var link = urn.substring(pos+5);
		    pos = link.search("_");
		    var head_node=link.substring(0,pos);
		    link=link.substring(pos+1);
		    pos = link.search("_");
		    var head_port=link.substring(0,pos);
		    link=link.substring(pos+1);
		    pos = link.search("_");
		    var tail_node=link.substring(0,pos);
	            link=link.substring(pos+1);
		    var tail_port=link;
                
		   
		    var link_type="packet";

		    if (urn.search('opticalpacket')!=-1){
			link_type='opticalpacket';
		    }
		    else if (urn.search('optical')!=-1){
			link_type='optical';
		    }
		    else if (urn.search('compute')!=-1){
			link_type='compute';
		    }
		    else if (urn.search('federation')!=-1){
			link_type='federation';
		    }
		    
		    //get island name
		    pos = urn.search('ofam');
		    var testbed=urn.substring(pos+5);
		    testbed=testbed.substring(0, testbed.search('link')-1);
	    
	    	    var found=false;
		    for(i=0;i<table_links.length;i++){
				if((table_links[i].head_node==head_node && table_links[i].tail_node==tail_node && table_links[i].head_port==head_port && table_links[i].tail_port==tail_port) || 
				   (table_links[i].head_node==tail_node && table_links[i].tail_node==head_node && table_links[i].head_port==tail_port && table_links[i].tail_port==head_port)){
					found=true;
					break;
				}
		    }

		    if (found == false){
				var tmp_link={};
				tmp_link['head_node']=head_node;
				tmp_link['tail_node']=tail_node;
				tmp_link['head_port']=head_port;
				tmp_link['tail_port']=tail_port;
				tmp_link['testbed']=testbed;
				tmp_link['link_type']=link_type;
				tmp_link['urn']=urn;
				table_links.push(tmp_link);
		    }
			   
		}

	},


	process_records: function(link){

	 // this models a line in dataTables, each element in the line describes a cell
            line = new Array();
     
            // go through table headers to get column names we want
            // in order (we have temporarily hack some adjustments in names)
            var cols = this.table.fnSettings().aoColumns;
            var colnames = cols.map(function(x) {return x.sTitle})
            var nb_col = cols.length;
            /* if we've requested checkboxes, then forget about the checkbox column for now */
            if (this.options.checkboxes) nb_col -= 1;
	    
	    for (var j = 0; j < nb_col; j++) {
		        if (typeof colnames[j] == 'undefined') {
		            line.push('...');
			} else if (colnames[j] == 'testbed') {
			   line.push(link.testbed);
		        } else if (colnames[j] == 'head node id/port') {
			    line.push(link.head_node+"/"+link.head_port);
			}
			  else if (colnames[j] == 'tail node id/port'){
			    line.push(link.tail_node+"/"+link.tail_port);
			}
			  else if (colnames[j] == 'link type'){
			    line.push(link.link_type);
			}
			  else if (colnames[j] == 'selected'){
			    
			    line.push(this.fake_checkbox_html(link.urn));
			}

	     }

	       // catch up with the last column if checkboxes were requested 
	    if (this.options.checkboxes) {
		        // Use a key instead of hostname (hard coded...)
		        line.push(this.checkbox_html(record));
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
	    if (debug) messages.debug("univbrisfoam.set_checkbox_from_record, init_id="+init_id);
	    // using table.$ to search inside elements that are not visible
	    var element = this.table.$('[init_id="'+init_id+'"]');
	    element.attr('checked',checked);
	},

	// id relates to canonical_key
	set_checkbox_from_data: function (id, checked) {
            if (checked === undefined) checked = true;
	    if (debug) messages.debug("univbrisfoam.set_checkbox_from_data, id="+id);
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
            alert('UnivbrisFoam::clear_fields() not implemented');
        },


	/* sync query handler*/

	on_sync_filter_added:function(filter)
	{
		//alert("sync query filter called");
		this.filter=[];
		this.on_filter_added(filter);
	},

	 on_sync_filter_clear: function()
        {
            // XXX
	    this.filters=Array();
            this.redraw_table();
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
            alert('UnivbrisFoam::clear_fields() not implemented');
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
	    this.buffered_lines=[];	
	    for(var i=0;i<table_links.length;i++){
		this.process_records(table_links[i]);
	    }
	    this.table.fnAddData (this.buffered_lines);
	    this.buffered_lines=[];
	    //alert(regex_filter)
	    /*try{
	        //this.table.column(3).search("packet",True,True).draw();
		this.table.fnFilter(regex_filter,3,true);
	    }
	    catch (err){
		alert(err);
	    }*/
	    
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
	    //alert(options);
            this.elts('querytable-checkbox').unbind('click').click(this, this._check_click);
	   // this.elts("next").unbind('click').click(this, this.fnButnext);
	    $(".checkboxlink").unbind('click').click(this,this.fnLinkClick);

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
            manifold.raise_event(self.options.query_uuid, this.checked?SET_ADD:SET_REMOVED, id);
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

    $.plugin('UnivbrisFoam', UnivbrisFoam);

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

     /*function fnLinkClick(link){
		console.log("link has been clicked: ");
		console.log(link);
	}*/

})(jQuery);

