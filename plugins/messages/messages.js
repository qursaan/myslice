/**
 * MySlice Messages plugin
 * Version: 0.1.0
 * URL: http://www.myslice.info
 * Description: Display debug messages in a DIV
 * Requires: 
 * Author: The MySlice Team
 * Copyright: Copyright 2012 UPMC Sorbonne Universités
 * License: GPLv3
 */

( function($) {

    /* Method calling logic */
    $.fn.Messages = function( method ) {
	if ( methods[method] ) {
	    return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
	} else if ( typeof method === 'object' || ! method ) {
	    return methods.init.apply( this, arguments );
	} else {
	    $.error( 'Method ' +  method + ' does not exist on $.Messages' );
	}    
    };

    var methods = {
        init : function( options ) {

            return this.each(function(){
                var $this = $(this),
                  data = $this.data('Messages'), 
                  Messages = $('<div />', { text : $this.attr('title') });

                // If the plugin hasn't been initialized yet
                if ( ! data ) {
                    $(this).data('Messages', {
                        plugin_uuid: options.plugin_uuid,
                        target : $this,
                        Messages : Messages,
		    });
         
                    /* Plugin initialization */
                    $.subscribe("messages:fatal", {'plugindiv': $this,'level':'fatal'}, display_message);
                    $.subscribe("messages:error", {'plugindiv': $this,'level':'error'}, display_message);
                    $.subscribe("messages:warning", {'plugindiv': $this,'level':'warning'}, display_message);
                    $.subscribe("messages:info", {'plugindiv': $this,'level':'info'}, display_message);
                    $.subscribe("messages:debug", {'plugindiv': $this,'level':'debug'}, display_message);
                    $.publish  ("messages:info", 'Subscribed to all 5 message channels');
                    /* End of plugin initialization */
                }
            });
        },
        destroy : function( ) {

            return this.each(function(){
                var $this = $(this), data = $this.data('Messages');
                $(window).unbind('Messages');
                data.Messages.remove();
                $this.removeData('Messages');
            });
        },
/*
    reposition : function( ) { // ... },
    show : function( ) { // ... },
    hide : function( ) { // ... },
*/
        update : function( content ) { },
    };

    /* Private methods */

    function display_message(e, message) {
	var level=e.data.level;
	var domid=e.data.plugindiv.data('Messages').plugin_uuid;
	var html="";
	html += "<li class='" + level + "'>";
	html += "<span class='messages-date'>" + new Date() + "</span>";
	html += "<span class='messages-level'>[" + level + "]</span>";
//	html += "[" + domid + "]";
	html += " " + message + "</li>";
	$("ul#"+domid+".messages").append(html);
    }
    
})(jQuery);

// temporary

var messages_test = {
    // set this to 0 to disable
    counter : 3,
    period : 3000,
    sample : function () { 
	$.publish("messages:fatal","a fatal message (" + messages_test.counter + " runs to go)");
	$.publish("messages:error","an error message");
	$.publish("messages:warning","a warning message");
	$.publish("messages:info","an info message");
	$.publish("messages:debug","a debug message");
	messages_test.counter -= 1;
	if (messages_test.counter == 0)
	    window.clearInterval (messages_test.interval_id);
    },
    run: function () {
	messages_test.interval_id=window.setInterval(messages_test.sample , 5000);
    }
}
messages_test.run()
