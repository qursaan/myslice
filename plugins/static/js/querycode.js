/**
 * MySlice QueryCode plugin
 * URL: http://trac.myslice.info
 * Description: display code for a target query in python or ruby
 * Author: The MySlice Team
 * Copyright (c) 2012 UPMC Sorbonne Universite - INRIA
 * License: GPLv3
 */

querycode_debug=false;
querycode_debug=true;

function debug_object (msg, o) {
    var keys=[];
    for (var k in o) keys.push(k);
    console.log (msg + " Keys : " + keys);
}

(function($) {
  
    var methods = {
	init : function (options) {
	    return this.each(function() {
		var $this=$(this);
		var data=$this.data('QueryCode');
		if ( ! data ) {
		    // Subscribe to query updates
		    var channel='/results/' + options.query_uuid + '/updated';
		    /* passing $this as 2nd arg: callbacks will retrieve $this as e.data */
		    $.subscribe(channel, $this, update_plugin);
		    if (querycode_debug) window.console.log('subscribing to ' + channel);
		    $this.data('QueryCode', {options: options});
		    // react to changes to the language selector
		    $this.find(".querycode-lang").change(change_language);
		}
	    });

	console.log("temporarily turned off SyntaxHighlighter ...");
//      SyntaxHighlighter.all();

	}, 

//	destroy : function( ) {
//	    if (querycode_debug) console.log("QueryCode.destroy...");
//	},
//	update : function( content ) { 
//	    if (querycode_debug) console.log("QueryCode.update...");
//	},
	trigger : function () {
	    var channel='/results/' + $(this).data.QueryCode.options.query_uuid + '/updated';
	    publish(channel,"trigger");
	}
	    
	
    } // methods
			  
    $.fn.QueryCode = function( method ) {
        /* Method calling logic */
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.QueryCode' );
        }    
    };

    // we retrieve the plugindiv as e.data - cf the 2nd arg to subscribe
    function update_plugin (e) {
	var $plugindiv=e.data;
	do_update ($plugindiv);
    }

    // linked to 'change' on the selector; this=the selector dom
    function change_language (e) {
	var $plugindiv = $(this).closest(".plugin");
	do_update($plugindiv);
    }
 
    function do_update ($plugindiv) {
	// just in case
	$plugindiv.closest('.need-spin').spin(false);

	var lang=$plugindiv.find(".querycode-lang").val();
	var dom=$plugindiv.find(".querycode-viz");
	var query = $plugindiv.data().QueryCode.options.query;
	funname="translate_query_as_" + lang;
	fun=eval(funname);
	if ( ! fun) {
	    console.log("Cannot find translator function for lang " + lang);
	    return;
	}
	html_code=fun(query);
	dom.html(html_code);
	console.log("turned off SyntaxHighlighter.highlight");
//	SyntaxHighlighter.highlight()

    }


    // private stuff
    function translate_query_as_ruby (query) {
	debug_object("query_ruby entering -- query=" + query, query);
	var output = '# Connection to XMLRPC server\n';
	output += 'require "xmlrpc/client"\n';
	output += 'require "pp"\n';
	output += '\n';
	output += 'XMLRPC::Config.module_eval do\n';
	output += '  remove_const :ENABLE_NIL_PARSER\n';
	output += '  const_set :ENABLE_NIL_PARSER, true\n';
	output += 'end\n';
	output += 'srv = XMLRPC::Client.new2("https://www.top-hat.info/API/")\n';
	//output += 'tophat = xmlrpclib.ServerProxy("' . (TOPHAT_API_PORT == 443 ? 'http' : 'https') . '://' . TOPHAT_API_HOST . ':' . TOPHAT_API_PORT . TOPHAT_API_PATH . '", allow_none=True)\n\n';
	output += '\n';
	output += '# Authentication token\n';
	output += 'auth = {"AuthMethod" => "password", "Username" => "guest", "AuthString" => "guest"}\n';
	output += '\n';

	ifs = '';
	$.each(query.filters, function(i, value) {
            if (ifs != '') ifs += ', ';
            ifs += '"';
            if (value[1] != "=")
		ifs += value[1];
            ifs += value[0] + '" => "' + value[2] + '"';
	});
	ifs = '{' + ifs + '}';
	
	ofs = '';
	$.each(query.fields, function(index, value) {
            if (ofs != '')
		ofs += ', ';
            ofs += '"' + value + '"';
	});
	ofs = '[' + ofs + ']';

	output += 'pp srv.call("' + query.action +'", auth, "' + query.method + '", "' + query.timestamp + '", ' + ifs + ', ' + ofs + ')';

	var output = '<pre class="brush: ruby; toolbar: false;">' + output + "</pre>";
	return output;

    }

    function translate_query_as_python (query) {
	// xxx tmp
	var TOPHAT_API_HOST="hostname", TOPHAT_API_PORT=443, TOPHAT_API_PATH="/path";
	var proto = (TOPHAT_API_PORT == 443 ? 'https' : 'http');
	var output = '# Connection to XMLRPC server\n';
	output += 'import xmlrpclib\n';
	output += 'srv = xmlrpclib.ServerProxy("' + proto + '://' + TOPHAT_API_HOST + ':' + TOPHAT_API_PORT + TOPHAT_API_PATH + '", allow_none=True)\n\n';
	output += '# Authentication token\n';
	output += 'auth = {"AuthMethod": "password", "Username": "name.surname@domain.name", "AuthString": "mypassword"}\n\n';

	ifs = '';
	$.each(query.filters, function(i, value) {
            if (ifs != '')
		ifs += ', ';
            //ifs += '"'
            //if (value[1] != "=")
            //    ifs += value[1];
            ifs += '["' + value[0] + '", "' + value[1] + '", "' + value[2] + '"]';
	});
	ifs = '[' + ifs + ']';
	
	ofs = '';
	$.each(query.fields, function(index, value) {
            if (ofs != '')
		ofs += ', ';
            ofs += '"' + value + '"';
	});
	ofs = '[' + ofs + ']';

	output += 'srv.' + query.action + '(auth, "' + query.method + '", ' + ifs + ', {}, ' + ofs + ')';
	var output = '<pre class="brush: python; toolbar: false;">' + output + "</pre>";
	return output;
    }
    


    // get these plugins to update their contents upon loading
    // manually publishing on the right channel
//    $(function () { $(".QueryCode").each(function () { this.trigger(); })})

})(jQuery); // end closure wrapper

