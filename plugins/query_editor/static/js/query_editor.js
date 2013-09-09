/**
 * Description: QueryEditor plugin
 * Copyright (c) 2012-2013 UPMC Sorbonne Universite
 * License: GPLv3
 */

// XXX TODO This plugin will be interested in changes in metadata
// What if we remove a filter, is it removed in the right min/max field ???
//  -> no on_filter_removed is not yet implemented
// XXX if a plugin has not declared a handler, it might become inconsistent,
// and the interface should either reset or disable it
(function($){

    var QueryEditor = Plugin.extend({

        event_filter_added: function(op, suffix) {
            suffix = (typeof suffix === 'undefined') ? '' : manifold.separator + suffix;
            var self = this;
            return function(e) {
                var array = self.array_from_id(e.target.id);
                var key   = self.field_from_id(array); // No need to remove suffix...
                var value = e.target.value;

                if (value) {
                    // XXX This should be handled by manifold
                    //manifold.raise_event(object.options.query_uuid, FILTER_UPDATED, [key, op, value]);
                    manifold.raise_event(self.options.query_uuid, FILTER_ADDED, [key, op, value]);
                } else {
                    // XXX This should be handled by manifold
                    manifold.raise_event(self.options.query_uuid, FILTER_REMOVED, [key, op]);
                }
            }
        },

        init: function(options, element) {
            this._super(options, element);

            this.listen_query(options.query_uuid);

            this.els('queryeditor-auto-filter').change(this.event_filter_added('='));
            this.els('queryeditor-filter').change(this.event_filter_added('='));
            this.els('queryeditor-filter-min').change(this.event_filter_added('>'));
            this.els('queryeditor-filter-max').change(this.event_filter_added('<'));

            var self = this;
            this.els('queryeditor-check').click(function() { 
                manifold.raise_event(self.options.query_uuid, this.checked?FIELD_ADDED:FIELD_REMOVED, this.value);
            });

            /* The following code adds an expandable column for the table
            // XXX Why isn't it done statically ?
            var nCloneTh = document.createElement( 'th' );
            var nCloneTd = document.createElement( 'td' );
            nCloneTd.innerHTML = "<span class='ui-icon ui-icon-triangle-1-e' style='cursor:pointer'></span>";
            //nCloneTd.innerHTML = '<img src="/components/com_tophat/images/details_open.png">';
            nCloneTh.innerHTML = '<b>Info</b>';
            nCloneTd.className = "center";
            nCloneTh.className = "center";
            this.el('table thead tr').each(function() {
                this.insertBefore(nCloneTh, this.childNodes[0]);
            });
            this.el('table tbody tr').each(function() {
                this.insertBefore(nCloneTd.cloneNode( true ), this.childNodes[0]);
            });
            */
         
            // We are currently using a DataTable display, but another browsing component could be better
            //jQuery('#'+this.options.plugin_uuid+'-table').dataTable...
            var  metaTable = this.el('table').dataTable({
                bFilter     : false,
                bPaginate   : false,
                bInfo       : false,
                sScrollX    : '100%',         // Horizontal scrolling
                sScrollY    : '200px',
                //bJQueryUI   : true,           // Use jQuery UI
                bProcessing : true,           // Loading
                aaSorting   : [[ 1, "asc" ]], // sort by column fields on load
                aoColumnDefs: [
                    { 'bSortable': false, 'aTargets': [ 0 ]},
                    { 'sWidth': '8px', 'aTargets': [ 0 ] },
                    { 'sWidth': '8px', 'aTargets': [ 4 ] } // XXX NB OF COLS
                ]
            });

            var self = this;
            // Actions on the newly added fields
            this.el('table tbody td span').on('click', function() {
                var nTr = this.parentNode.parentNode;
                // use jQuery UI instead of images to keep a common UI
                // class="ui-icon treeclick ui-icon-triangle-1-s tree-minus"
                // East oriented Triangle class="ui-icon-triangle-1-e"
                // South oriented Triangle class="ui-icon-triangle-1-s"
                
                if (this.className=="ui-icon ui-icon-triangle-1-e") {
                    this.removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
                    // XXX ??????
                    metaTable.fnOpen(nTr, this.fnFormatDetails(metaTable, nTr, self.options.plugin_uuid+'_div'), 'details' );
                } else {
                    this.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
                    metaTable.fnClose(nTr);
                }
            });

            this.el('table_wrapper').css({
                'padding-top'   : '0em',
                'padding-bottom': '0em'
            });

        }, // init

        /* UI management */

        check_field: function(field)
        {
            this.el('check', field).attr('checked', true);
        },

        uncheck_field: function(field)
        {
            this.el('check', field).attr('checked', false);
        },

        update_filter_value: function(filter, removed)
        {
            removed = !(typeof removed === 'undefined'); // default = False

            var key   = filter[0];
            var op    = filter[1];
            var value = filter[2];

            var id = this.id_from_field(key);

            if (op == '=') {
                var element = this.el(id);
            } else {
                var suffix;
                if (op == '<') {
                    this.el(id, 'max').val(value);
                } else if (op == '>') {
                    this.el(id, 'min').val(value);
                } else {
                    return;
                }
                var element = this.el(id, suffix);
            }

            element.val(removed?null:value);

        },

        /* Events */

        on_filter_added: function(filter)
        {
            this.update_filter_value(filter);
        },

        on_filter_removed: function(filter)
        {
            this.update_filter_value(filter, true);
        },

        on_field_added: function(field)
        {
            this.check_field(field);
        },

        on_field_removed: function(field)
        {
            this.uncheck_field(field);
        },

        /* Former code not used at the moment */

        print_field_description: function(field_header, div_id) 
        { 
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
        },

        update_autocomplete: function(e, rows, current_query)
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
        }, // update_autocomplete     

        fnFormatDetails: function( metaTable, nTr, div_id ) 
        {
            var aData = metaTable.fnGetData( nTr );
            var sOut = '<blockquote>';
            //sOut += prepare_tab_description(aData[1].substr(21, aData[1].length-21-7), div_id);
            sOut += this.print_field_description(aData[1].substring(3, aData[1].length-4), div_id);
            sOut += '</blockquote>';
         
            return sOut;
        }
    });

    $.plugin('QueryEditor', QueryEditor);

})(jQuery);
