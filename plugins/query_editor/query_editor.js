/**
 * Description: QueryEditor plugin
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite
 * License: GPLv3
 */

/*
 * It's a best practice to pass jQuery to an IIFE (Immediately Invoked Function
 * Expression) that maps it to the dollar sign so it can't be overwritten by
 * another library in the scope of its execution.
 */

(function($){

    var PLUGIN_NAME = 'QueryEditor';

    // routing calls
    jQuery.fn.QueryEditor = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			jQuery.error( 'Method ' +  method + ' does not exist on jQuery.' + PLUGIN_NAME );
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

            return this.each(function() {

                var $this = $(this);

                /* An object that will hold private variables and methods */
                var plugin = new QueryEditor(options);
                $this.data('Manifold', plugin);

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
                var hazelnut = $this.data('Manifold');

                // Unbind all events using namespacing
                $(window).unbind(PLUGIN_NAME);

                // Remove associated data
                hazelnut.remove();
                $this.removeData('Manifold');

                $this.set_query_handler(options.query_uuid, hazelnut.query_handler);
                $this.set_record_handler(options.query_uuid, hazelnut.record_handler); 

                /* XXX Subscribe to query updates to maintain current state of query (multiple editors) */
                jQuery.subscribe('/query/' + options.query_uuid + '/changed', {instance: $this}, query_changed);
                jQuery.subscribe('/query/' + options.query_uuid + '/diff', {instance: $this}, query_changed_diff);
                /* Subscribe to results in order to redraw the table when updates arrive */
                jQuery.subscribe('/results/' + options.query_uuid + '/changed', {instance: $this}, update_autocomplete);

            });
        }, // destroy

    }; // var methods;

    /***************************************************************************
     * Plugin object
     ***************************************************************************/

    function QueryEditor(options)
    {

        /* member variables */
        this.options = options;

        var object = this;

        this.initialize_table = function(data) 
        {

            var d = data;
            
            jQuery('.queryeditor-filter').change(function(event) { 
                query = data.current_query;
                var key=getKeySplitId(event.target.id,"-");
                var op='=';
                var value=event.target.value;
                            
                if(value){                
                    query.update_filter(key, op, value);
                    //add_ActiveFilter(event.target.id, '=',event.target.value,data);
                }else{
                    query.remove_filter(key,op,"");
                    //remove_ActiveFilter(event, data, event.target.id,'=');
                }
                // Publish the query changed, the other plugins with subscribe will get the changes
                jQuery.publish('/query/' + query.uuid + '/changed', query);
            });
            jQuery('.queryeditor-filter-min').change(function(event) {
                query = data.current_query;
                var key=getKeySplitId(event.target.id,"-");
                var op='>';
                var value=event.target.value;
                
                if(value){
                    query.update_filter(key, op, value);
                    //add_ActiveFilter(event.target.id,'>',event.target.value,data);
                }else{
                    query.remove_filter(key,op,"");
                    //remove_ActiveFilter(event, data, event.target.id,'>');
                }
                // Publish the query changed, the other plugins with subscribe will get the changes
                jQuery.publish('/query/' + query.uuid + '/changed', query);
            });
            jQuery('.queryeditor-filter-max').change(function(event) {
                query = data.current_query;
                var key=getKeySplitId(event.target.id,"-");
                var op='<';
                var value=event.target.value;
                
                if(value){
                    query.update_filter(key, op, value);
                    //add_ActiveFilter(event.target.id,'<',event.target.value,data);
                }else{
                    query.remove_filter(key,op,"");
                    //remove_ActiveFilter(event, data, event.target.id,'<');
                }
                // Publish the query changed, the other plugins with subscribe will get the changes
                jQuery.publish('/query/' + query.uuid + '/changed', query);
            });

            jQuery('.queryeditor-check').click(function() { 
                manifold.raise_event(object.options.query_uuid, this.checked?SET_ADD:SET_REMOVED, this.value);
                /*
                    var column = this.id.substring(6);
                    query = data.current_query;
                    if (this.checked) {
                        if (jQuery.inArray(column, query.fields) == -1) {
                            query.fields.push(column);
                            jQuery.publish('/query/' + query.uuid + '/changed', query);
                        }
                    } else {
                        query.fields = jQuery.grep(query.fields, function(value) {return value != column;});
                        jQuery.publish('/query/' + query.uuid + '/changed', query);
                    }
                */
                });

            //onFunctionAvailable('jQuery.fn.dataTable', function() {

                var nCloneTh = document.createElement( 'th' );
                var nCloneTd = document.createElement( 'td' );
                nCloneTd.innerHTML = "<span class='ui-icon ui-icon-triangle-1-e' style='cursor:pointer'></span>";
                //nCloneTd.innerHTML = '<img src="/components/com_tophat/images/details_open.png">';
                nCloneTh.innerHTML = '<b>Info</b>';
                nCloneTd.className = "center";
                nCloneTh.className = "center";
         
                jQuery('#'+this.options.plugin_uuid+'_fields thead tr').each( function () {
                    this.insertBefore( nCloneTh, this.childNodes[0] );
                });
         
                jQuery('#'+this.options.plugin_uuid+'_fields tbody tr').each( function () {
                    this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
                });
         
                var  metaTable = jQuery('#'+this.options.plugin_uuid+'-table').dataTable( {
                    bFilter: false,
                    bPaginate: false,
                    bInfo: false,
                    sScrollX: '100%',       /* Horizontal scrolling */
                    sScrollY: "200px",
                    bJQueryUI: true, // Use jQuery UI
                    bProcessing: true, // Loading
                    aaSorting: [[ 1, "asc" ]], // sort by column fields on load
                    aoColumnDefs: [ {"bSortable": false, "aTargets": [ 0 ]},
                                      { "sWidth": "8px", "aTargets": [ 0 ] },
                                      { "sWidth": "8px", "aTargets": [ 4 ] }
                    ]
                });

                jQuery('#'+this.options.plugin_uuid+'_fields tbody td span').live('click', function () {
                    var nTr = this.parentNode.parentNode;
                    // use jQuery UI instead of images to keep a common UI
                    // class="ui-icon treeclick ui-icon-triangle-1-s tree-minus"
                    //East oriented Triangle class="ui-icon-triangle-1-e"
                    //South oriented Triangle class="ui-icon-triangle-1-s"
                    
                    if(this.className=="ui-icon ui-icon-triangle-1-e"){
                        this.removeClass("ui-icon-triangle-1-e");
                        this.addClass("ui-icon-triangle-1-s");
                        metaTable.fnOpen( nTr, this.fnFormatDetails(metaTable, nTr, this.options.plugin_uuid+'_div'), 'details' );
                    }else{
                        this.removeClass("ui-icon-triangle-1-s");
                        this.addClass("ui-icon-triangle-1-e");
                        metaTable.fnClose( nTr );
                    }
                    /*
                    if ( this.src.match('details_close') ) {
                        this.src = "/components/com_tophat/images/details_open.png";
                        metaTable.fnClose( nTr );
                    }
                    else {
                        this.src = "/components/com_tophat/images/details_close.png";
                        metaTable.fnOpen( nTr, this.fnFormatDetails(metaTable, nTr, this.options.plugin_uuid+'_div'), 'details' );
                    }
                    */
                });

                jQuery('#'+this.options.plugin_uuid+'_fields_wrapper').css({'padding-top':'0em','padding-bottom':'0em'});

            //}); // onfunctionAvailable

        } // initialize_table

        this.print_field_description = function(field_header, div_id) { 
            
            //var selected = all_headers[field_header];
            var selected = getMetadata_field('resource',field_header);

            field_header = div_id+"_"+field_header;

            var output = "<div id='desc"+field_header+"'>";

            output += "<div id='divinfo"+field_header+"'>";
            output += '<p><span class="column-title">'+selected['title']+'</span></p></span>'; 
            output += '<p><span class="column-detail">'+selected['description']+'</span></p></span>'; 

            var period_select = "<select id='selectperiod"+field_header+"'><option value='Now'> Now </option><option value='latest'> Latest  </option><option value=w> Week </option><option value=m> Month </option><option value=y> Year </option></select>";

            if (selected['value_type'] == 'string') {

                var values_select = "<p><select id='selectvalues"+field_header+"' MULTIPLE size=3>";

                output += '<p>Values: ';

                var values_list = selected['allowed_values'].split(",");

                for (var value_index = 0; value_index < values_list.length ; value_index++) {
                    var value_desc = values_list[value_index].split("-");
                    if (value_index > 0)
                        output += ', ';
                    output += '<span class="bold">'+value_desc[0]+'</span>';
                    values_select += "<option value ='"+value_desc[0]+"'>&nbsp;"+value_desc[0];
                    if (value_desc[1]!='') 
                        output += ' ('+value_desc[1]+')';

                    values_select += "&nbsp;</option>";
                }
                values_select += "</select>";
            }
            else
                output+='<p>Unit: '+selected['unit'];

            output+= '</p>';

            output += '<p>Source: <a class="source-url" target="source_window" href="'+selected['platform_url']+'">'+selected['platform']+'</a>';

            //if (selected['via'] != '') 
                //output += ' via <a class="source-url" target="source_window" href="http://'+selected['via_url']+'">'+selected['via']+'</a>';

            output += '</p>';
            output += "</div>";

    /*
            output += "<div id='divgroup"+field_header+"'>";
            output += "<p>Group resources with the same value <input type=checkbox></input>";
            output += "<p>Select aggregator : <select><option>Count</option><option selected=true>Average</option><option>Maximum</option><option>Minimum</option></select>";
            output += "</div>";
            output += "<div id='divtime"+field_header+"'>";
            output += "<p>Select timestamp : ";
            output += period_select;
            output += "</div>";
    */
            output += "</div>";

            return output;
        }

        this.update_autocomplete = function(e, rows, current_query)
        {
            var d = data;
            d.current_query = current_query;
            var availableTags={};
            jQuery.each (rows, function(index, obj) {                    
                jQuery.each(obj,function(key,value){                       
                    value = get_value(value); 
                    if(!availableTags.hasOwnProperty(key)){availableTags[key]=new Array();}
                    //availableTags[key].push(value);
                    var currentArray=availableTags[key];
                    if(value!=null){
                        if(jQuery.inArray(value,currentArray)==-1){availableTags[key].push(value);}
                    }
                });                    
            });
            jQuery.each(availableTags, function(key, value){
                value.sort();
                jQuery("#"+options.plugin_uuid+"-filter-"+key).autocomplete({
                            source: value,
                            selectFirst: true,
                            minLength: 0, // allows to browse items with no value typed in
                            select: function(event, ui) {
                                var key=getKeySplitId(this.id,"-");
                                var op='=';
                                var val=ui.item.value;
                                
                                query=d.current_query;
                                query.update_filter(key,op,val);
                                // Publish the query changed, the other plugins with subscribe will get the changes
                                jQuery.publish('/query/' + query.uuid + '/changed', query);
                                //add_ActiveFilter(this.id,'=',ui.item.value,d);
                            }
                });
            });                
        } // update_autocomplete     

        /**
         * This function is used to update autocomplete
         */
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

        this.query_handler = function(e, event_type, data)
        {
            // This replaces the complex set_query function
            // The plugin does not need to remember the query anymore
            switch(event_type) {
                // Filters
                // When Query changed, Then we need to update the filters of
                // QueryEditor plugin if the filter is active, set the value
                // (the update can come from another plugin) else set the
                // filter value to null PB if the filter is composed of MIN/MAX
                // values
                case FILTER_ADDED:
                    filter = data;
                    // Set the value of the filter = to query filter value
                    // Necessary if the filter has been modified by another plugin (QuickFilter)
                    if(filter[1]=="="){
                        jQuery('#'+this.options.plugin_uuid+'-filter-'+filter[0]).val(filter[2]);
                    }else if(filter[1]=="<"){
                        jQuery('#'+this.options.plugin_uuid+'-filter-'+filter[0]+'-max').val(filter[2]);
                    }else if(filter[1]==">"){
                        jQuery('#'+this.options.plugin_uuid+'-filter-'+filter[0]+'-min').val(filter[2]);
                    }
                case FILTER_REMOVED:
                    filter = data;
                    if(filter[1]=="="){
                        jQuery('#'+this.options.plugin_uuid+'-filter-'+filter[0]).val(null);
                    }else if(filter[1]=="<"){
                        //502124d5a5848-filter-asn-max
                        jQuery('#'+this.options.plugin_uuid+'-filter-'+filter[0]+'-max').val(null);
                    }else if(filter[1]==">"){
                        //502124d5a5848-filter-asn-min
                        jQuery('#'+this.options.plugin_uuid+'-filter-'+filter[0]+'-min').val(null);
                    }
                case CLEAR_FILTERS:
                    break;

                // Fields
                /* Hide/unhide columns to match added/removed fields */
                case FIELD_ADDED:
                    $('#check_' + data).attr('checked', true);
                    break;
                case FIELD_REMOVED:
                    $('#check_' + data).attr('checked', false);
                    break;
                case CLEAR_FIELDS:
                    alert(PLUGIN_NAME + '::clear_fields() not implemented');
                    break;
            } // switch


        }
        this.fnFormatDetails  = function( metaTable, nTr, div_id ) {
            var aData = metaTable.fnGetData( nTr );
            var sOut = '<blockquote>';
            //sOut += prepare_tab_description(aData[1].substr(21, aData[1].length-21-7), div_id);
            sOut += this.print_field_description(aData[1].substring(3, aData[1].length-4), div_id);
            sOut += '</blockquote>';
         
            return sOut;
        }
       
            
        /**
         *
         */
        this.initialize = function() {
            //XXX
            this.initialize_table(jQuery(this).data());
        }
        /* Constructor */

        this.initialize();

    } // function PresView

})( jQuery );
