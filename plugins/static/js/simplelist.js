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

(function($){
    var methods = {
	init : function( options ) {
	    return this.each(function(){
		var $this = $(this);
		var data = $this.data('SimpleList');
//		console.log("data" + data);
//		looks like $this.attr('title') is undefined..
//		console.log('iterating in simplelist.init with data='+data+' and title='+$this.attr('title'));
		/* create an empty DOM object */		
		var SimpleList = $('<div />', { text : $this.attr('title') });
		// If the plugin hasn't been initialized yet
		if ( ! data ) {
		    /* Subscribe to query updates */
		    var url='/results/' + options.query_uuid + '/changed';
		    $.subscribe(url, {instance: this}, update_list);
		    window.console.log('subscribing to ' + url);
		    $this.data('SimpleList', {options: options, target : this, SimpleList : SimpleList});
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
            e.data.instance.html('No result !');
            return;
        }
        if (typeof rows[0].error != 'undefined') {
            e.data.instance.html('ERROR: ' + rows[0].error);
            return;
        }
        options = e.data.instance.data().SimpleList.options;
        is_cached = options.query.ts != 'now' ? true : false;
        e.data.instance.html(myslice_html_ul(rows, options.key, options.value, is_cached)+"<br/>");
        
    }

    function myslice_html_li(type, value, is_cached) {
        var cached = '';
        //if (is_cached)
        //    cached='<div class="cache"><span><b>Cached information from the database</b><br/>Timestamp: XX/XX/XX XX:XX:XX<br/><br/><i>Refresh in progress...</i></span></div>';
        if (type == 'slice_hrn') {
            return "<li class='icn icn-play'><a href='/view/slice/" + value + "'>" + value + cached + "</a></li>";
        } else if (type == 'network_hrn') {
            return "<li class='icn icn-play'>" + value + cached + "</li>";
        } else {
            return "<li>" + value + "</li>";
        }
    }
    
    function myslice_html_ul(data, key, value, is_cached) {
        var out = "<ul>";
        for (var i = 0; i < data.length; i++) {
            out += myslice_html_li(key, data[i][value], is_cached);
            //out += myslice_html_li(key, myslice_html_a(data[i][key], data[i][value], key), is_cached);
        }
        out += "</ul>";
        return out;
    }
    
})( jQuery );
