// utilities 
function debug_dict_keys (msg, o) {
    var keys=[];
    for (var k in o) keys.push(k);
    messages.debug ("debug_dict_keys: " + msg + " keys= " + keys);
}
function debug_dict (msg, o) {
    for (var k in o) messages.debug ("debug_dict: " + msg + " [" + k + "]=" + o[k]);
}
function debug_value (msg, value) {
    messages.debug ("debug_value: " + msg + " " + value);
}
function debug_query (msg, query) {
    if (query === undefined) messages.debug ("debug_query: " + msg + " -> undefined");
    else if (query == null) messages.debug ("debug_query: " + msg + " -> null");
    else if ('query_uuid' in query) messages.debug ("debug_query: " + msg + query.__repr());
    else messages.debug ("debug_query: " + msg + " query= " + query);
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
	    messages.debug("manifold.debug " + msg + " " + query_uuid + " -> " + manifold.all_queries[query_uuid]);
	}
    },

    // trigger a query asynchroneously
    proxy_url : '/manifold/proxy/json/',

    asynchroneous_debug : true,

    // Executes all async. queries
    // input queries are specified as a list of {'query_uuid': <query_uuid>, 'id': <possibly null>}
    asynchroneous_exec : function (query_publish_dom_tuples) {
	// start spinners

	// in case the spin stuff was not loaded, let's make sure we proceed to the exit 
	try {
	    if (manifold.asynchroneous_debug) 
		messages.debug("Turning on spin with " + jQuery(".need-spin").length + " matches for .need-spin");
	    jQuery('.need-spin').spin(spin_presets);
	} catch (err) { messages.debug("Cannot turn on spins " + err); }
	
	// We use js function closure to be able to pass the query (array) to the
	// callback function used when data is received
	var success_closure = function(query, publish_uuid, domid) {
	    return function(data, textStatus) {manifold.asynchroneous_success(data, query, publish_uuid, domid);}};
	
	// Loop through input array, and use publish_uuid to publish back results
	jQuery.each(query_publish_dom_tuples, function(index, tuple) {
	    var query=manifold.find_query(tuple.query_uuid);
	    var query_json=JSON.stringify (query);
	    var publish_uuid=tuple.publish_uuid;
	    // by default we publish using the same uuid of course
	    if (publish_uuid==undefined) publish_uuid=query.query_uuid;
	    if (manifold.asynchroneous_debug) {
		messages.debug("sending POST on " + manifold.proxy_url + " to be published on " + publish_uuid);
		messages.debug("... ctd... with actual query= " + query.__repr());
	    }
	    // not quite sure what happens if we send a string directly, as POST data is named..
	    // this gets reconstructed on the proxy side with ManifoldQuery.fill_from_POST
            jQuery.post(manifold.proxy_url, {'json':query_json} , success_closure(query, publish_uuid, tuple.domid));
	})
	    },

    // if set domid allows the result to be directed to just one plugin
    // most of the time publish_uuid will be query.query_uuid
    // however in some cases we wish to publish the results under a different uuid
    // e.g. an updater wants to publish its results as if from the original (get) query
    asynchroneous_success : function (data, query, publish_uuid, domid) {
	if (manifold.asynchroneous_debug) messages.debug("received manifold result with code " + data.code);
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
            if (!!domid) {
		/* Directly inform the requestor */
		if (manifold.asynchroneous_debug) messages.debug("directing results to " + domid);
		jQuery('#' + domid).trigger('results', [data]);
            } else {
		/* Publish an update announce */
		if (manifold.asynchroneous_debug) messages.debug("publishing results on " + publish_uuid);
		jQuery.publish("/results/" + publish_uuid + "/changed", [data, query]);
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

