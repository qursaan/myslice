
/**
 * MySlice QuickFilter plugin
 * Version: 0.1.0
 * URL: http://www.myslice.info
 * Description: A simple Plugin that prints some important variables, to be used as a template
 * Requires: 
 * Author: The MySlice Team
 * Copyright: Copyright 2012 UPMC Sorbonne Universités
 * License: GPLv3
 */

(function( $ ){

  var methods = {
     init : function( options ) {

       return this.each(function(){
         
         var $this = jQuery(this),
             data = $this.data('QuickFilter'), QuickFilter = jQuery('<div />', {text : $this.attr('title')});
         
         // If the plugin hasn't been initialized yet
         if ( ! data ) {
         
            /* Plugin initialization */
            
            data = jQuery(this).data();

            /* Subscribe to selection updates published by the resource display plugins*/
            //jQuery.subscribe('selected', {instance: $this}, resource_selected);
            jQuery.subscribe('/query/' + options.query_uuid + '/changed', {instance: $this}, query_changed);


            /* End of plugin initialization */

            jQuery(this).data('QuickFilter', {
                plugin_uuid: options.plugin_uuid,
                query_uuid: options.query_uuid,
                target : $this,
                QuickFilter : QuickFilter
            });

            jQuery(this).data('current_query', null);

            initialize_plugin(jQuery(this).data());
            
            function update_options(e, rows){
                var d = data;
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
                    if(jQuery("#"+options.plugin_uuid+"-select_"+key).length>0){
                        jQuery.each(value, function(k, optValue){
                            jQuery("#"+options.plugin_uuid+"-select_"+key).append('<option>'+optValue+'</option>');
                        });
                    }                    
                    if(jQuery("#QuickFilter-string-"+key).length>0){
                        jQuery("#QuickFilter-string-"+key).autocomplete({
                                    source: value,
                                    minLength: 0, // allows to browse items with no value typed in
                                    select: function(event, ui) {
                                        //var key=getKeySplitId(this.id,"-");
                                        var op='=';
                                        var val=ui.item.value;

                                        query=d.current_query;
                                        query.update_filter(key,op,val);
                                        // Publish the query changed, the other plugins with subscribe will get the changes
                                        jQuery.publish('/query/' + query.uuid + '/changed', query);
                                        //add_ActiveFilter("#QuickFilter-string-"+key,ui.item.value,d);
                                    }
                        });
                    }
                });   
                
                
            }     
            
            /* Subscribe to results in order to redraw the table when updates arrive */
            jQuery.subscribe('/results/' + options.query_uuid + '/changed', {instance: $this}, update_options);
         }

       });
     },
    destroy : function( ) {

        return this.each(function(){
            var $this = jQuery(this), data = $this.data('QuickFilter');
            jQuery(window).unbind('QuickFilter');
            data.QuickFilter.remove();
            $this.removeData('QuickFilter');
        })

    },
/*
    reposition : function( ) { // ... },
    show : function( ) { // ... },
    hide : function( ) { // ... },
*/
    update : function( content ) { }
  };

    jQuery.fn.QuickFilter = function( method ) {
        /* Method calling logic */
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            jQuery.error( 'Method ' +  method + ' does not exist on jQuery.QuickFilter' );
        }    

    };


    /* Private methods */

    function query_changed(e, query)
    {
        //panos: this takes a lot of time!
        data = e.data.instance.data();
        var plugin_uuid=data.QuickFilter.plugin_uuid;
        
        /* Compare current and advertised query to get added and removed fields */
        var previous_query=data.current_query;
        /* Save the query as the current query */
        data.current_query=query;
        
        // XXX can we modify data directly ?
        //jQuery(data.QuickFilter.target).data('current_query', query);

        if(previous_query!=null){
            // If query has changed in another plugin
            // set the value on each filter that exists in QuickFilter plugin          
            if (typeof(previous_query) != 'undefined') {
                var tmp=previous_query.diff_filter(query);
                // Remove first to clean up select boxes
                var removed_filters = tmp.removed;
                jQuery.each(removed_filters, function(i,filter){
                    console.log(filter[0]);
                    allowedValues=getMetadata_property('resource', filter[0], 'allowed_values');
                    if (allowedValues!='' && allowedValues!="N/A") {
                    //if(all_headers[filter[0]]['allowed_values']!=''){
                        jQuery('#QuickFilter_select_field').val("#");
                        jQuery('#QuickFilter_select_value').children().remove().end();
                        jQuery('#QuickFilter_select_value_container').hide();
                    }
                    if(jQuery('#'+plugin_uuid+'-select_'+filter[0]).length>0 && filter[1]=="="){
                        jQuery('#'+plugin_uuid+'-select_'+filter[0]).val(null);
                    }
                    if(jQuery("#QuickFilter-string-"+filter[0]).length>0 && filter[1]=="="){
                        jQuery("#QuickFilter-string-"+filter[0]).val(null); 
                    }
                });
                // Then Add filters
                var added_filters = tmp.added;
                jQuery.each(added_filters, function(i,filter){
                    if(jQuery('#'+plugin_uuid+'-select_'+filter[0]).length>0 && filter[1]=="="){
                        jQuery('#'+plugin_uuid+'-select_'+filter[0]).val(filter[2]);
                    }
                    if(jQuery("#QuickFilter-string-"+filter[0]).length>0 && filter[1]=="="){
                        jQuery("#QuickFilter-string-"+filter[0]).val(filter[2]); 
                    }
                });
            }
        jQuery.publish('debug', "Quick Filter received fields: " + query.fields+" - filter = "+query.filter);
        }
    }
    
    function initialize_plugin(data) {

        jQuery('#QuickFilter_select_value_div').hide();
        jQuery('#QuickFilter_string_value_div').hide();
        jQuery('#QuickFilter_int_value_div').hide();

        jQuery('#QuickFilter_only_visible').click( function () {

            var only_visible = this.checked;
            // Clear all options in the select box, Then add None option
            jQuery('#QuickFilter_select_field').children().remove().end().append("<option value='#'>None</option>");
            
            // Get the current query (ONLY AFTER THE PLUGIN HAS BEEN INITIALIZED)
            var query = data.current_query;
            // iterate to remove each active filter
            if (only_visible) {
                if (typeof(query.fields) != 'undefined') {
                    jQuery.each (query.fields, function(index, value) {
                        jQuery('#QuickFilter_select_field').append("<option>"+value+"</option>");  
                    });            
                }
            }else{
                headers=getMetadata_fields('resource');
                jQuery.each (headers, function (key, value) {
                        jQuery('#QuickFilter_select_field').append("<option>"+value['column']+"</option>");
                });
            }
        });

        jQuery('#QuickFilter_select_field').change( function () {
            var field = jQuery(this).val();
            console.log(field);
            jQuery('input[id^="QuickFilter-string-"]').hide();
            jQuery('#QuickFilter_int_value_div').hide();
            if(field=="#"){
                jQuery('#QuickFilter_select_value_container').hide();
            }else{
                jQuery('#QuickFilter_select_value_container').show();
                jQuery.publish('debug','field selected = '+field);
                valType=getMetadata_property('resource', field, 'value_type');
                if (valType == 'string' || valType=="N/A") {
                    // If this key has predefined values, build a select with each allowed values as options
                    allowedValues=getMetadata_property('resource', field, 'allowed_values');
                    if (allowedValues!='' && allowedValues!="N/A") {
                        jQuery('#QuickFilter_string_value_div').hide();
                        jQuery('#QuickFilter_int_value_div').hide();
                        jQuery('#QuickFilter_select_value_div').show();
                        jQuery('#QuickFilter_select_value').show();
                        jQuery('#QuickFilter_select_value').children().remove().end().append("<option value=''>all</option>");
// @TODO: define seperator as ;
                        allowed_values = allowedValues.split(",");
                        jQuery.each (allowed_values, function (key, value) {
                            jQuery('#QuickFilter_select_value').append("<option>"+value+"</option>");
                        });
                    // Else build an autocomplete based on the values of result query
                    }else{
                        jQuery('#QuickFilter_select_value_div').hide();
                        jQuery('#QuickFilter_string_value_div').show();
                        jQuery('.QuickFilter-filter-value').hide();
                        jQuery('#QuickFilter-string-'+field).show();
                        jQuery('#QuickFilter_int_value_div').hide();
                    }
                }
                else if (valType == 'int') {
                    jQuery('#QuickFilter_select_value_div').hide();
                    jQuery('#QuickFilter_string_value_div').hide();
                    jQuery('#QuickFilter_int_value_div').show();
                }
            }
        });

        jQuery('.QuickFilter-filter-value').change( function () {
            var query = data.current_query;

            var filter_value = jQuery(this).val();
            var filter_field = jQuery('#QuickFilter_select_field').val();

            query.update_filter(filter_field, '=', filter_value);
            jQuery.publish('/query/' + query.uuid + '/changed', query);
        });
        
        jQuery('.QuickFilter_select').change( function() {
            console.log(this.id);
            var query = data.current_query;
	    var f_value = $(this).val();
            
            var key = this.id.split("_");

            // jordan ???
/*            
	        if (f_value == "Network")
	            f_value = "";
*/
            if(typeof(key[1])!="undefined"){
                console.log(key[1]+'='+f_value);
                if(f_value==""){
                    query.remove_filter(key[1],"","");
                }else{
                    query.update_filter(key[1], '=', f_value);
                }
            }
            jQuery.publish('/query/' + query.uuid + '/changed', query);
        });

    }

})( jQuery );



