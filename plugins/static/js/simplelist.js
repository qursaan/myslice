/**
 * MySlice SimpleList plugin
 * Version: 0.1.0
 * URL: http://www.myslice.info
 * Description: display simple lists like slices or testbeds
 * Requires: 
 * Author: The MySlice Team
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

simplelist_debug=false;

(function($){
    var methods = {
	init : function( options ) {
	    return this.each(function(){
		var $this = $(this);
		var data = $this.data('SimpleList');
		/* create an empty DOM object */		
		var SimpleList = $('<div />', { text : $this.attr('title') });
		// If the plugin hasn't been initialized yet
		if ( ! data ) {
		    /* Subscribe to query updates */
		    var channel='/results/' + options.query_uuid + '/changed';
		    /* passing $this as 2nd arg: callbacks will retrieve $this as e.data */
		    $.subscribe(channel, $this, update_list);
		    if (simplelist_debug) window.console.log('subscribing to ' + channel);
		    $this.data('SimpleList', {options: options, SimpleList : SimpleList});
		}
	    });
	},
	destroy : function( ) {
            return this.each(function(){
		var $this = $(this), data = $this.data('SimpleList');
		$(window).unbind('SimpleList');
		data.SimpleList.remove();
		$this.removeData('SimpleList');
            })
    },
	update : function( content ) { }
    };

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

    /* Private methods */
    function update_list(e, rows) {
	// e.data is what we passed in second argument to subscribe
	var $this=e.data;
	// locate the <tbody>, expected layout being
	// <div class='plugin'> <table> <thead /> <tbody /tbody> </table> </div>
	// -- or, if we don't have a header --
	// <div class='plugin'> <table> <tbody /tbody> </table> </div>
	var $tbody=$this.find("tbody.simplelist").first();
	if (simplelist_debug) console.log("$tbody goes with "+$tbody.get(0));

        if (rows.length == 0) {
            $tbody.html("<tr><td class='simplelist-empty'>No result !</tr></td>");
            return;
        }
        if (typeof rows[0].error != 'undefined') {
            e.data.html("<tr><td class='simplelist-error'>ERROR: " + rows[0].error + "</td></tr>");
            return;
        }
        var options = e.data.data().SimpleList.options;
        var is_cached = options.query.timestamp != 'now' ? true : false;
	// here is where we use 'key' and 'value' from the SimpleList (python) constructor
	html_code=myslice_html_tbody(rows, options.key, options.value, is_cached);
	// locate the tbody from the template, set its text
        $tbody.html(html_code);
	// clear the spinning wheel
	var $elt = e.data;
	if (simplelist_debug) console.log("about to unspin with elt #" + $elt.attr('id') + " class " + $elt.attr('class'));
	$elt.closest('.need-spin').spin(false);
    }

    function myslice_html_tbody(data, key, value, is_cached) {
//	return $.map (...)
        var out = "";
        for (var i = 0; i < data.length; i++) {
            out += myslice_html_tr(key, data[i][value], is_cached);
        }
        return out;
    }
    
    function myslice_html_tr(key, value,is_cached) {
        var cached = is_cached ? "(cached)" : "";
        if (key == 'slice_hrn') {
            return "<tr><td class='simplelist'><i class='icon-play-circle'></i><a href='/slice/" + value + "'>" + value + cached + "</a></td></tr>";
        } else if (key == 'network_hrn') {
            return "<tr><td class='simplelist'><i class='icon-play-circle'></i>" + value + cached + "</td></tr>";
        } else {
            return "<tr><td class='simplelist'>" + value + "</td></tr>";
        }
    }
    
})( jQuery );
