/**
 * Description: display a query result in a datatables-powered <table>
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */ 

(function($){

    var debug=false;
    debug=true

    pk_flowspace_index=0;
    opt_flowspace_index=0;
    pk_mode=0;
    fvf_add=1;
    fvf_nrow=0;
    

    var UnivbrisFv = Plugin.extend({

	
        init: function(options, element) {
	    //alert("foam init called");
	    this.classname="univbrisfv";
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
	    if ( ! this.init_key ) messages.warning ("UnivbrisFv : cannot find init_key");
	    if ( ! this.canonical_key ) messages.warning ("UnivbrisFv : cannot find canonical_key");
	    if (debug) messages.debug("UnivbrisFv: canonical_key="+this.canonical_key+" init_key="+this.init_key);

            /* Setup query and record handlers */
            //this.listen_query(options.query_uuid);
            //this.listen_query(options.query_all_uuid, 'all');

            /* GUI setup and event binding */
            this.initialize_table();
	    
        },

        /* PLUGIN EVENTS */

        on_show: function(e) {
	    if (debug) messages.debug("univbrisfv.on_show");
            var self = e.data;
            self.table.fnAdjustColumnSizing();
	},        

        on_resize: function(e) {
	    if (debug) messages.debug("univbrisfv.on_resize");
            var self = e.data;
            self.table.fnAdjustColumnSizing();
	},        

        /* GUI EVENTS */

        /* GUI MANIPULATION */

        initialize_table: function() 
        {

	    
            /* Transforms the table into DataTable, and keep a pointer to it */
            var self = this;
	    //alert(self.options);
            var actual_options = {
                // Customize the position of Datatables elements (length,filter,button,...)
                // we use a fluid row on top and another on the bottom, making sure we take 12 grid elt's each time
                //sDom: "<'row'<'col-xs-5'l><'col-xs-1'r><'col-xs-6'f>>t<'row'<'col-xs-5'i><'col-xs-7'p>>",
		sDom: "<'row'<'col-xs-5'l><'col-xs-1'r><'col-xs-6'f>>t<'row'<'col-xs-5'i><'col-xs-7'p>><'buttons'>",
		//sDom: "<'row'<'col-xs-9'r>t<'buttons'>",
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
		//fnFooterCallback: function() {self._univbrisfv_footer_callback.call(self,nFoot, aData, iStart, iEnd, aiDisplay)};}
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

	    
            this.table = $("#univbris_flowspace_selection__table").dataTable(actual_options);	
	    
	    
	    
	    //alert(this.table.$("name"));

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

	    //document.getElementById('buttons').text-align='center';

	    /**$('<table><tr><td><button id="add_flowspace" type="button" style="height: 25px; width: 400px; text-align: center" onclick="fnAddflowspace()">Define another packet  flowspace</button></td>').appendTo('div.buttons');

	    $('<table><tr><td><button id="add_flowspace" type="button" style="height: 25px; width: 400px" onclick="fnAddflowspace()">Define another optical  flowspace</button></td>').appendTo('div.buttons');

	    $('<td><button id="submit_flowspace" type="button" style="height: 25px; width: 400px" onclick="fnButsubmit()">Submit flowspaces</button></td></tr></table>').appendTo('div.buttons');

	    $('<td><button id="submit_flowspace" type="button" style="height: 25px; width: 400px" onclick="fnButsubmit()">Define controller location</button></td></tr></table>').appendTo('div.buttons');**/
	
	   
	    //jQuery( "#univbris_flowspace_selection" ).hide();

	      //$('<a href="http://localhost:8000/login/" id="next_link">next link</a>').appendTo('div.submit');

		//this.new_record("t");
		//this.new_record("t");
		//this.new_record("t");
		//this.new_record("t");
		//this.new_record("t");
		this._querytable_draw_callback();
		jQuery("#univbris_flowspace_selection").hide();	
		

        }, // initialize_table


	fnButsubmit:function(e){
		console.log("verifying before submitting");

		query_uuid=e.data.options.query_uuid;
		try{

			 var controller= $('#controller_loc').val();

			 //validating controller field
			 //alert (controller.length);
			 if (controller.length>=7){
				//alert(controller.substring(0,4))
				if(controller.substring(0,4)=="tcp:" | controller.substring(0,4)=="ssl:"){
					var controller_ip=controller.substring(4,controller.length);
					//alert(controller_ip)
					var index=controller_ip.indexOf(":")
					if (index!=-1){
						var controller_ip1=controller_ip.substring(0,index);
						//alert(controller_ip1);
						var ip_validator= /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/; 
						if (!controller_ip1.match(ip_validator)){
						  throw "Incorrect IP format";
						}
						//else{
						//  throw "incorrect ip";
						//}

						var controller_port=controller_ip.substring(index+1,controller_ip.length);
						if(!isNaN(controller_port)){
							controller_port=parseInt(controller_port,10);
							if (!((controller_port >0) & (controller_port <65536))){
							//if(controller_port >0){
								throw "Incorrect controller port";
							}
							//else{
							//	throw "correct port";
							//}
						}
						else{
							throw "Incorrect controller port";
						}
					}
					else{
						throw "Incorrect controller specified";
					} 
				}
				else{
					throw "Controller must start with tcp: or ssl:";
				}

			 }
			 else{
			    throw "Incorrect controller specified";
			 }
			 //end of validation of controller field
	 
			 var rows = $("#univbris_flowspace_selection__table").dataTable().fnGetNodes();
			 var cells=[];
			 
			 var json_rspec={};
			 json_rspec["controller"]=controller;
			 var groups_rspec=[];
			 var matches_rspec=[];

			 if (rows.length <=0) {
				throw "No Flowspace defined"
			 }


			 var queryStringToJSON = function (url) {
                if (url === '') return '';
                var pairs = (url || location.search).slice(1).split('&');
                var result = {};
                for (var idx in pairs) {
                    if ($.isNumeric(idx)) {
                	    var pair = pairs[idx].split('=');
                	    if (!!pair[0]){
                			result[pair[0].toLowerCase()] = decodeURIComponent(pair[1].replace(/\+/g, " ") || '');
                        }
                    }
                }
                return result;
			}

			 for(var i=0;i<rows.length;i++){
				var htmlStr=$(rows[i]).find("td:eq(0)").html();
				var parser=new DOMParser();
				var htmlDoc=parser.parseFromString(htmlStr, "text/html");
				var para=htmlDoc.getElementsByTagName('p');
				if(typeof para.item(0).id != 'undefined'){
					cells.push(para.item(0).id);
					var m_form=para.item(0).id.split(",");
					var result=queryStringToJSON("?"+m_form[0]);
					matches_rspec.push(result);
					//console.log(m_form[1]);
					var result2=queryStringToJSON("?"+m_form[1]);
					result2["flowspace_name"]=result["flowspace_name"];
					groups_rspec.push(result2);
				}
			 }

			json_rspec["groups"]=groups_rspec;
			json_rspec["matches"]=matches_rspec;	

			//console.log(JSON.stringify(json_rspec));


			//var controller= $('#controller_loc').val();

			//cells.push("controller="+controller);

			
			

			//var str="";		

			//Just for show: built output string 
			//for(var i=0;i<cells.length;i++){
			//	str+=cells[i]+"\n";

			//}
		    //alert(str);
            data = {
                state: STATE_SET,
                key  : null,
                op   : STATE_SET_ADD,
                value: json_rspec 
            }
            manifold.raise_event(query_uuid, FIELD_STATE_CHANGED, data);

		    //alert("sending to manifold backend to build rspec");

		}
		catch(err){
			alert(err)
		}
		
				
	},



	fnAddflowspace:function(e){
		query_uuid=e.data.options.query_uuid;
		pk_mode=1;
		hideFvfError();
		var port_table=$("#univbris_foam_ports_selection__table").dataTable();
		var nodes = $('input',port_table.fnGetNodes());
		for(var i=0;i<nodes.length;i++){
			nodes[i].checked=false;
			nodes[i].disabled=false;
		}

		fvf_add=1;
		$("#uob_fv_table_form").trigger("reset");
		var port_table = $("#univbris_flowspace_selection__table").DataTable();
		//alert("table length" + this.table.fnGetNodes().length);	
		$("#flowspace_name").val("pk_flowspace_"+ pk_flowspace_index);
		//pk_flowspace_index=1+pk_flowspace_index;
		$("[id='addflowspaceform']").show();
		$("#uob_fv_table_form :input").prop("disabled", false);
		$("[name='flowspace_name']").prop("disabled", true);
		$("[id='cancel_addflowspaceform']").text('cancel');
		$("[id='addflowspaceform']").text('add flowspace');
		
		try{
			manifold.raise_event(e.data.options.query_uuid,CLEAR_FILTERS);
			var filter=[];
			filter.push("link type");
			filter.push("!=");
			filter.push("optical");
			manifold.raise_event(e.data.options.query_uuid,FILTER_ADDED,filter);
		}
		catch(err){
			alert("raise error:"+err);
		}

		var svg_links = svg.selectAll(".link");
		for(var i=0;i<svg_links[0].length;i++){
			svg_links[0][i].style.stroke= '#ccc';
			svg_links[0][i].style.strokeWidth= '4px';
		};


		jQuery("#univbris_flowspace_selection").hide();	
		jQuery("#uob_fv_table_form").show();
		jQuery( "#univbris_foam_ports_selection" ).show();
		
		
		topoviewer_state={mode:"edit",link_type:"non-optical"};

		jQuery('#topo_plugin').show();
		
	},

	fnAddcflowspace:function(e){
		pk_mode=0;
		query_uuid=e.data.options.query_uuid;
		hideFvfError();
		var port_table=$("#univbris_foam_ports_selection__table").dataTable();
		var nodes = $('input',port_table.fnGetNodes());
		for(var i=0;i<nodes.length;i++){
			nodes[i].checked=false;
			nodes[i].disabled=false;
		}

		$("#uob_ofv_table_form").trigger("reset");
		$("#oflowspace_name").val("opt_flowspace_"+ opt_flowspace_index);
		fvf_add=1;
		$("[id='addflowspaceform']").show();
		$("#uob_ofv_table_form :input").prop("disabled", false);
		$("[name='oflowspace_name']").prop("disabled", true);
		$("[id='cancel_addflowspaceform']").text('cancel');
		$("[id='addflowspaceform']").text('add flowspace');

		try{
			manifold.raise_event(e.data.options.query_uuid,CLEAR_FILTERS);
			var filter=[];
			filter.push("link type");
			filter.push("!=");
			filter.push("packet");
			manifold.raise_event(e.data.options.query_uuid,FILTER_ADDED,filter);
			filter=[];
			filter.push("link type");
			filter.push("!=");
			filter.push("compute");
			manifold.raise_event(e.data.options.query_uuid,FILTER_ADDED,filter);
			filter=[];
			filter.push("link type");
			filter.push("!=");
			filter.push("federation");
			manifold.raise_event(e.data.options.query_uuid,FILTER_ADDED,filter);
		}
		catch(err){
			alert("raise error:"+err);
		}

		var svg_links = svg.selectAll(".link");
		for(var i=0;i<svg_links[0].length;i++){
			svg_links[0][i].style.stroke= '#ccc';
			svg_links[0][i].style.strokeWidth= '4px';
		};

		jQuery( "#univbris_flowspace_selection" ).hide();
		jQuery("#uob_ofv_table_form").show();
		jQuery( "#univbris_foam_ports_selection" ).show();



		topoviewer_state={mode:"edit",link_type:"optical"};

		jQuery("#topo_plugin").show();		
	},

	

	fnDelete:function(e){
	    		e.preventDefault();
			//alert("delwete");
	    		var nRow = $(this).parents('tr')[0];
			this.table = $("#univbris_flowspace_selection__table").dataTable();
	   		this.table.fnDeleteRow( nRow );
	},

	fnEdit:function(e){	
	    		e.preventDefault();
			fvf_add=0;
			hideFvfError();
			
			try{
		    		var nRow = $(this).parents('tr')[0];
				fvf_nrow=nRow;
				var row= $("#univbris_flowspace_selection__table").dataTable().fnGetData(nRow);
				var parser=new DOMParser();
				var htmlDoc=parser.parseFromString(row[0], "text/html");
				//alert("html_doc"+htmlDoc);
				var para=htmlDoc.getElementsByTagName('p');
			}
			catch(err){
				alert("error:"+err);

			}
			//alert("p id:"+ para.item(0).id);
			var m_form=para.item(0).id.split(",");
			//console.log(htmlDoc.getElementsByTagName('a'));
			$("#uob_fv_table_form").trigger("reset");
			$("#uob_fv_table_form :input").prop("disabled", false);
			$("[name='flowspace_name']").prop("disabled", false);
			$("#uob_fv_table_form").deserialize(m_form[0]);

			try{
				deserializeDT(m_form[1]);
			}
			catch (err){
				alert("error:"+err);
			}

			 var port_table=$("#univbris_foam_ports_selection__table").dataTable();
			 var nodes = $('input',port_table.fnGetNodes());
			 var svg_links = svg.selectAll(".link");

			 for(n=0;n<nodes.length;n++){
				for(var i=0;i<svg_links[0].length;i++){
					if(svg_links[0][i].__data__.value==nodes[n].id){
						if(nodes[n].checked==true){
							svg_links[0][i].style.stroke= 'black';
							svg_links[0][i].style.strokeWidth= '5px';
						}
						else{
							svg_links[0][i].style.stroke= '#ccc';
							svg_links[0][i].style.strokeWidth= '4px';
						}
						break;
					}
				}
				nodes[n].disabled=false;
			};
			
			//alert($("#flowspace_name").val());

			if  ($("#flowspace_name").val().search("pk")==0){
				topoviewer_state={mode:"edit",link_type:"non-optical"};
			}
			else{
				topoviewer_state={mode:"edit",link_type:"optical"};
			}

			
			
		        $("[name='flowspace_name']").prop("disabled", true);
			$("[id='cancel_addflowspaceform']").prop("disabled", false);
			$("[id='addflowspaceform']").prop("disabled", false);
			$("[id='addflowspaceform']").text('modify');
			$("[id='addflowspaceform']").show();			
			jQuery( "#univbris_foam_ports_selection" ).show();				
			jQuery("#uob_fv_table_form").show();
			jQuery("#univbris_flowspace_selection").hide();
			jQuery('#topo_plugin').show();
			
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
            result += " class='univbrisfv-checkbox'";
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
            //result += " class='univbrisfv-checkbox'";
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
	    if (debug) messages.debug("univbrisfv.set_checkbox_from_record, init_id="+init_id);
	    // using table.$ to search inside elements that are not visible
	    var element = this.table.$('[init_id="'+init_id+'"]');
	    element.attr('checked',checked);
	},

	// id relates to canonical_key
	set_checkbox_from_data: function (id, checked) {
            if (checked === undefined) checked = true;
	    if (debug) messages.debug("univbrisfv.set_checkbox_from_data, id="+id);
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
            alert('UnivbrisFv::clear_fields() not implemented');
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
            alert('UnivbrisFv::clear_fields() not implemented');
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
	    $("#submit_flowspace").unbind('click').click(this, this.fnButsubmit);
	    $("#add_flowspace").unbind('click').click(this, this.fnAddflowspace);
	    $("#add_opt_flowspace").unbind('click').click(this, this.fnAddcflowspace);
	    $('#univbris_flowspace_selection__table .edit').unbind('click').click(this, this.fnEdit);
            $('#univbris_flowspace_selection__table .delete').unbind('click').click(this, this.fnDelete);
	    /*var edits=this.elts.all.find('.edit');
	    edits.each(function(){
		this.unbind('click').click(this,this.fnEdit);
	     }
	    */
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

   

    $.plugin('UnivbrisFv', UnivbrisFv);

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



