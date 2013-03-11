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
        if (rows.length == 0) {
            e.data.html('No result !');
            return;
        }
        if (typeof rows[0].error != 'undefined') {
            e.data.html('ERROR: ' + rows[0].error);
            return;
        }
        var options = e.data.data().SimpleList.options;
        var is_cached = options.query.timestamp != 'now' ? true : false;
	html_code=myslice_html_ul(rows, options.key, options.value, is_cached)+"<br/>";
        e.data.html(html_code);
	var $elt = e.data;
	if (simplelist_debug) console.log("about to unspin with elt #" + $elt.attr('id') + " class " + $elt.attr('class'));
	$elt.closest('.need-spin').spin(false);
    }

    function myslice_html_ul(data, key, value, is_cached) {
        var out = "<ul>";
        for (var i = 0; i < data.length; i++) {
            out += myslice_html_li(key, data[i][value], is_cached);
        }
        out += "</ul>";
        return out;
    }
    
    function myslice_html_li(key, value,is_cached) {
        var cached = is_cached ? "(cached)" : "";
        if (key == 'slice_hrn') {
            return "<li class='slice-hrn'><i class='icon-play-circle'></i><a href='/slice/" + value + "'>" + value + cached + "</a></li>";
        } else if (key == 'network_hrn') {
            return "<li class='network-hrn'><i class='icon-play-circle'></i>" + value + cached + "</li>";
        } else {
            return "<li>" + value + "</li>";
        }
    }
    
})( jQuery );
