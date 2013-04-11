/**
 * Description: display messages in a dedicated area, with buttons for filtering on level
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
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

            return this.each (function() {
                var $this = $(this);
		instance=new Messages (options,$this);
		$this.data('Messages',instance);
		for (level in options.levels) {
		    (function (instance,level) {
			$.subscribe("/messages/"+level, function (e, msg){ instance.display_message (msg,level)});
		    }) (instance,level);
		}
		// this happens very early - even before the document is loaded
		// so it won't show right away; no big deal though
                $.publish  ("/messages/info", 'Subscribed to all 5 message channels');
            });
        },
        destroy : function( ) {

            return this.each(function(){
                var $this = $(this), instance = $this.data('Messages');
                $(window).unbind('Messages');
                instance.remove();
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

    function Messages (options,plugindiv) {
	this.options=options;
	this.plugindiv=plugindiv;
	/* cannot use 'this' directly of course */
	(function (instance) { $( function () {instance.initialize();}) }) (this);

	this.is_active = function (level) { 
	    return this.plugindiv.find("div.messages-buttons>input[name="+level+"]").attr('checked');
	}
	this.display_message = function (incoming, level) {
	    var domid=this.plugindiv.attr('id');
	    var html="";
	    html += "<li class='" + level +"'"; 
	    if ( ! this.is_active(level) ) html += " style='display:none'";
	    html += ">";
	    html += "<span class='messages-date'>" + new Date() + "</span>";
	    html += "<span class='messages-level'>" + level + "</span>";
	    //	html += "[" + domid + "]";
	    html += " " + incoming + "</li>";
	    $("ul#"+domid+".messages").append(html);
	},

	this.initialize = function () {
	    var init_button=this.init_button;
	    var levels=this.options.levels;
	    this.plugindiv.find("div.messages-buttons>input").each(
		function (i,input) {init_button (input, levels)});
	    var arm_button=this.arm_button;
	    var toggle_handler=this.toggle_handler;
	    this.plugindiv.find("div.messages-buttons>input").each(
		function (i,input) {arm_button (input,toggle_handler); });
	},
	this.init_button = function (input,levels) {
	    /* set initial 'checked' state for that input from global 'levels' above */
	    var level=input.name;
	    if (levels[level]) $(input).attr('checked','checked');
	},
	this.arm_button = function (input,handler) {
	    $(input).click (handler);
	},
	/* as an event handler toggle_handler will see the DOM <input> as 'this' */
	this.toggle_handler = function (e) {
	    var $this=$(this);
	    // toggle the state of the checkbox
	    if ($this.attr('checked')) $this.removeAttr('checked');
	    else $this.attr('checked',true);
	    // turn messages on or off
	    var level=this.name;
	    var display = $this.attr('checked') ? "list-item" : "none";
	    var plugindiv=$this.closest("div.Messages");
	    plugindiv.find("li."+level).css("display",display);
	}

    };
    
})(jQuery);

/* turn this on for an auto-test on startup
var messages_test = {
    // set this to 0 to disable
    counter : 2,
    period : 1000,
    sample : function () { 
	$.publish("/messages/fatal","a fatal message (" + messages_test.counter + " runs to go)");
	$.publish("/messages/error","an error message");
	$.publish("/messages/warning","a warning message");
	$.publish("/messages/info","an info message");
	$.publish("/messages/debug","a debug message");
	messages_test.counter -= 1;
	if (messages_test.counter == 0)
	    window.clearInterval (messages_test.interval_id);
    },
    run: function () {
	messages_test.interval_id=window.setInterval(messages_test.sample , messages_test.period);
    }
}
messages_test.run()
*/
