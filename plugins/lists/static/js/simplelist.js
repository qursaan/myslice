/**
 * Description: display simple lists like slices or testbeds
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

(function($){

    var debug=false;
    debug=true

    $.fn.SimpleList = function( method ) {
        /* Method calling logic */
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.SimpleList' );
        }    
    };

    var methods = {
	init : function( options ) {
	    return this.each(function(){
		var $this = $(this), data = $this.data('SimpleList');
		/* Subscribe to query updates */
		var channel='/results/' + options.query_uuid + '/changed';
		/* passing $this as 2nd arg: callbacks will retrieve $this as e.data */
		$.subscribe(channel, $this, update_plugin);
		if (debug) window.messages.debug('subscribing to ' + channel);
		$this.data('SimpleList', options);
	    });
	},
	destroy : function( ) {
	    if (debug) messages.debug("SimpleList.destroy...");
            return this.each(function(){
		var $this = $(this), data = $this.data('SimpleList');
		// xxx not too sure what this is about
		$(window).unbind('SimpleList');
		$this.removeData('SimpleList');
            });
	},
	update : function( content ) { 
	    if (debug) messages.debug("SimpleList.update...");
	},
    }; // methods

    /* Private methods */
    // complexity here is mostly because a datatables-enabled table cannot
    // be updated in a "normal" way using .html()
    function update_plugin(e, rows) {
        // e.data is what we passed in second argument to subscribe
        // so here it is the jquery object attached to the plugin <div>
        var $plugindiv = e.data;
        var options = $plugindiv.data().SimpleList;
	var classname=options.classname;
        // locate the <table> element; with datatables in the way,
        // this might not be a direct son of the div-plugin
        var $table = $plugindiv.find("table."+classname).first();
        // also we may or may not have a header
        var $tbody = $table.find("tbody."+classname).first();
        var use_datatables = $table.hasClass("with-datatables");
        if (debug) 
            messages.debug($plugindiv.attr('id') + " udt= " + use_datatables + " rows="+rows.length);
	
	// clear the spinning wheel: look up an ancestor that has the need-spin class
	// do this before we might return
	    $plugindiv.closest('.need-spin').spin(false);

        if (rows.length == 0) {
	    if (use_datatables)
                datatables_set_message ($table, $tbody, unfold.warning("No result"));
	    else
        	regular_set_message ($table, $tbody, unfold.warning("No result"));
            return;
        }

        if (typeof rows[0].error != 'undefined') {
	    var error="ERROR: " + rows[0].error;
	    if (use_datatables) 
                datatables_set_message ($table, $tbody, unfold.error(error));
	    else
        	regular_set_message ($table, $tbody, unfold.error(error));
            return;
        }

	if (use_datatables)	
            datatables_update_table($table, $tbody, rows, options.key);
	else
  	    regular_update_table($table, $tbody, rows, options.key, classname);

    }

    // hard-wire a separate presentation depending on the key being used....
    function cell(key, value) {
        if (key == 'slice.slice_hrn') {
            return "<i class='icon-play-circle'></i><a href='/portal/slice/" + value + "'>" + value + "</a>";
        } else if (key == 'platform') {
            return "<i class='icon-play-circle'></i><a href='/portal/platform/" + value + "'>" + value + "</a>";
        } else {
            return value;
        }
    }

    function regular_set_message ($table, $tbody, message) {
	$tbody.html("<tr><td>"+message+"</td></tr>");
    }

    function regular_update_table ($table, $tbody, rows, key, classname) {
        if (debug)
            messages.debug('regular_update_table ' + rows.length + " rows" + " key=" + key + " classname=" + classname);
	var html=$.map(rows, function (row) {
            value = row;
            $.each(key.split('.'), function(i, k) {
                if ($.isArray(value)) {
                    value = $.map(value, function(val, i) { return val[k]});
                } else {
                    value = value[k];
                }
            });
		if ($.isArray(value)) {
                x = $.map(value, function(val, i) { 
		    messages.debug("loop.loop val="+val+" i="+i);
		    return html_row ( cell (key, val), classname); });
                return x;
            } else {
                return html_row ( cell (key, value), classname);
            }
        }).join();
    	$tbody.html(html);
    }
    
    function datatables_set_message ($table, $tbody, message) {
        $table.dataTable().fnClearTable();
        $table.dataTable().fnAddData( [ message ] );
        $table.dataTable().fnDraw();
    }

    function datatables_update_table ($table, $tbody, rows, key) {
	if (debug) messages.debug('datatables_update_table ' + rows.length + " rows");
	$table.dataTable().fnClearTable();
	// the lambda here returns a [[]] because $.map is kind of broken; as per the doc:
	// The function can return any value to add to the array. A returned array will be flattened into the resulting array.
	// this is wrong indeed so let's work around that
	$table.dataTable().fnAddData( $.map(rows, function (row) { return [[ cell (key,row[key]) ]] }) );
	$table.dataTable().fnDraw();
    }	
    
    function html_row (cell, classname) { 
        return "<tr><td class='"+classname+"'>"+cell+"</td></tr>"; 
    }
    
})( jQuery );
