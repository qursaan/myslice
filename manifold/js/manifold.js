// utilities 
function debug_dict (msg, o) {
    var keys=[];
    for (var k in o) keys.push(k);
    console.log ("debug_dict: " + msg + " keys= " + keys);
}
function debug_value (msg, value) {
    console.log ("debug_value: " + msg + " " + value);
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
	    console.log("manifold.debug " + msg + " " + query_uuid + " -> " + manifold.all_queries[query_uuid]);
	}
    },

    // trigger a query asynchroneously
    proxy_url : '/manifold/proxy/json/',

    asynchroneous_debug : true,

    // Executes all async. queries
    // input queries are specified as a list of {'query_uuid': <query_uuid>, 'id': <possibly null>}
    asynchroneous_exec : function (query_uuid_domids) {
	// start spinners
	jQuery('.need-spin').spin();
	
	// We use js function closure to be able to pass the query (array) to the
	// callback function used when data is received
	var success_closure = function(query, id) {
	    return function(data, textStatus) {manifold.asynchroneous_success(data, query, id);}};
	
	// Loop through query array and use ajax to send back query_uuid_domids (to frontend) with json
	jQuery.each(query_uuid_domids, function(index, tuple) {
	    var query=manifold.find_query(tuple.query_uuid);
	    var hash=query.to_hash();
	    if (manifold.asynchroneous_debug) 
		console.log ("sending POST on " + manifold.proxy_url + " iterating on " + tuple.query_uuid + " -> " + hash);
            jQuery.post(manifold.proxy_url, {'query': hash}, success_closure(query, tuple.id));
	})
	    },

    asynchroneous_success : function (data, query, id) {
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
