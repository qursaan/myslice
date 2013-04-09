// utilities 
function debug_dict_keys (msg, o) {
    var keys=[];
    for (var k in o) keys.push(k);
    console.log ("debug_dict_keys: " + msg + " keys= " + keys);
}
function debug_dict (msg, o) {
    for (var k in o) console.log ("debug_dict: " + msg + " [" + k + "]=" + o[k]);
}
function debug_value (msg, value) {
    console.log ("debug_value: " + msg + " " + value);
}
function debug_query (msg, query) {
    if (query === undefined) console.log ("debug_query: " + msg + " -> undefined");
    else if (query == null) console.log ("debug_query: " + msg + " -> null");
    else if ('query_uuid' in query) console.log ("debug_query: " + msg + query.__repr());
    else console.log ("debug_query: " + msg + " query= " + query);
}

/* ------------------------------------------------------------ */
// this namespace holds functions for globally managing query objects
var manifold = {

    all_queries: {},

    insert_query : function (query) { 
	manifold.all_queries[query.query_uuid]=query; 
    },
    find_query : function (query_uuid) { 
	return manifold.all_queries[query_uuid];
    },
    debug_all_queries : function (msg) {
	for (var query_uuid in manifold.all_queries) {
	    $.publish("messages:debug","manifold.debug " + msg + " " + query_uuid + " -> " + manifold.all_queries[query_uuid]);
	}
    },

    // trigger a query asynchroneously
    proxy_url : '/manifold/proxy/json/',

    asynchroneous_debug : true,

    // Executes all async. queries
    // input queries are specified as a list of {'query_uuid': <query_uuid>, 'id': <possibly null>}
    asynchroneous_exec : function (query_uuid_domids) {
	// start spinners

	if (manifold.asynchroneous_debug) 
	    $.publish("messages.debug","Turning on spin with " + jQuery(".need-spin").length + " matches for .need-spin");
	jQuery('.need-spin').spin(spin_presets);
	
	// We use js function closure to be able to pass the query (array) to the
	// callback function used when data is received
	var success_closure = function(query, id) {
	    return function(data, textStatus) {manifold.asynchroneous_success(data, query, id);}};
	
	// Loop through query array and use ajax to send back query_uuid_domids (to frontend) with json
	jQuery.each(query_uuid_domids, function(index, tuple) {
	    var query=manifold.find_query(tuple.query_uuid);
	    var query_json=JSON.stringify (query);
	    if (manifold.asynchroneous_debug) {
		$.publish("messages:debug","sending POST on " + manifold.proxy_url + " with query= " + query.__repr());
	    }
	    // not quite sure what happens if we send a string directly, as POST data is named..
	    // this gets reconstructed on the proxy side with ManifoldQuery.fill_from_POST
            jQuery.post(manifold.proxy_url, {'json':query_json} , success_closure(query, tuple.id));
	})
	    },

    asynchroneous_success : function (data, query, id) {
	if (manifold.asynchroneous_debug) 
	    $.publish("messages:debug","received manifold result with code " + data.code);
	// xxx should have a nicer declaration of that enum in sync with the python code somehow
	if (data.code == 1) {
	    alert("Your session has expired, please log in again");
	    window.location="/logout/";
	    return;
	} else if (data.code != 0) {
	    alert("Error received from manifold backend at " + MANIFOLD_URL + " [" + data.output + "]");
	    return;
	}
	// once everything is checked we can use the 'value' part of the manifoldresult
	data=data.value;
	if (data) {
            if (!!id) {
		/* Directly inform the requestor */
		jQuery('#' + id).trigger('results', [data]);
            } else {
		/* Publish an update announce */
		jQuery.publish("/results/" + query.query_uuid + "/changed", [data, query]);
            }

	}
    },

}; // manifold object
/* ------------------------------------------------------------ */

// extend jQuery/$ with pubsub capabilities
/* https://gist.github.com/661855 */
(function($) {

  var o = $({});

  $.subscribe = function( types, selector, data, fn) {
    /* borrowed from jQuery */
    if ( data == null && fn == null ) {
        // ( types, fn )
        fn = selector;
        data = selector = undefined;
    } else if ( fn == null ) {
        if ( typeof selector === "string" ) {
            // ( types, selector, fn )
            fn = data;
            data = undefined;
        } else {
            // ( types, data, fn )
            fn = data;
            data = selector;
            selector = undefined;
        }
    }
    /* </ugly> */

    /* We use an indirection function that will clone the object passed in
     * parameter to the subscribe callback 
     * 
     * FIXME currently we only clone query objects which are the only ones
     * supported and editable, we might have the same issue with results but
     * the page load time will be severely affected...
     */
    o.on.apply(o, [types, selector, data, function() { 
        for(i = 1; i < arguments.length; i++) {
            if ( arguments[i].constructor.name == 'Query' )
                arguments[i] = arguments[i].clone();
        }
        fn.apply(o, arguments);
    }]);
  };

  $.unsubscribe = function() {
    o.off.apply(o, arguments);
  };

  $.publish = function() {
    o.trigger.apply(o, arguments);
  };

}(jQuery));

/* ------------------------------------------------------------ */

//http://stackoverflow.com/questions/5100539/django-csrf-check-failing-with-an-ajax-post-request
//make sure to expose csrf in our outcoming ajax/post requests
$.ajaxSetup({ 
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                     break;
                 }
             }
         }
         return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     } 
});

